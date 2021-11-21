import { SigningStargateClient, QueryClient } from "@cosmjs/stargate"
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import config from "../../config"
import { Registry } from '@cosmjs/proto-signing'
import _m0 from "protobufjs/minimal";
import { MatchmakerProvider } from './matchmaker'
import { AuthorizationProvider } from './authorization'

import { 
  ErrKeplrNotEnabled,
  ErrNodeNotConnected,
  ErrUnableToSuggestChain,
  ErrNoAccount
} from './errors'

export class Provider {
    private client: SigningStargateClient
    private querier: QueryClient
    private address: string

    public readonly matchmaker: MatchmakerProvider
    public readonly authz: AuthorizationProvider
    public readonly chainID: string

    constructor(client: SigningStargateClient, querier: QueryClient, address: string) {
        this.client = client
        this.querier = querier
        this.address = address
        this.chainID = config.chainID
        this.matchmaker = new MatchmakerProvider(this.querier, this.client, this.address)
        this.authz = new AuthorizationProvider(this.querier, this.client, this.address)
    }

    public static async connect(): Promise<Provider> {
      if (!keplrEnabled() || !window.keplr.experimentalSuggestChain) {
          throw ErrKeplrNotEnabled
      }

      console.log("attempting to connect with keplr wallet")

      try { 
        suggestChainToKeplr()
      } catch (err) {
        console.error(err)
        throw ErrUnableToSuggestChain(err as string)
      }

      let tmClient: Tendermint34Client
      try {
        tmClient = await Tendermint34Client.connect(config.rpcEndpoint)
      } catch (err) {
        console.error(err)
        throw ErrNodeNotConnected(config.rpcEndpoint)
      }

      window.keplr.enable(config.chainID)

      const offlineSigner = window.keplr.getOfflineSigner(config.chainID)

      const registry = new Registry()
      MatchmakerProvider.register(registry)
      AuthorizationProvider.register(registry)

      const client = await SigningStargateClient.connectWithSigner(
          config.rpcEndpoint,
          offlineSigner,
          { registry: registry }
      )

      const querier = QueryClient.withExtensions(tmClient)

      const accounts = await offlineSigner.getAccounts()
      if (accounts.length === 0)
          throw ErrNoAccount

      return new Provider(client, querier, accounts[0].address)
    }

    isConnected() {
        return this.client != null && this.address != null
    }

    getAddress(): string {
        if (this.isConnected()) {
            return this.address as string
        }
        return ""
    }

    getQuerier(): QueryClient {
      return this.querier
    }

    async getBalance(): Promise<number> {
        if (this.client == null || this.address == null) {
        return -1
        }
        const coins = await this.client.getBalance(this.address, config.coinDenom)
        return convertURookBalance(coins.amount)
    }

    async getHeight(): Promise<number>{
        if (this.client == null) {
        return 0
        }
        return await this.client.getHeight()
    }    
    
}

export function keplrEnabled() {
  return window.getOfflineSigner && window.keplr
}

async function suggestChainToKeplr() {
  await window.keplr.experimentalSuggestChain({
    // Chain-id of the Cosmos SDK chain.
    chainId: config.chainID,
    // The name of the chain to be displayed to the user.
    chainName: config.chainName,
    // RPC endpoint of the chain.
    rpc: config.rpcEndpoint,
    // REST endpoint of the chain.
    rest: config.restEndpoint,
    // Staking coin information
    stakeCurrency: {
      // Coin denomination to be displayed to the user.
      coinDenom: config.displayedDenom,
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: config.coinDenom,
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: config.coinDecimals,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    },
    // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
    // The 'stake' button in Keplr extension will link to the webpage.
    // walletUrlForStaking: "",
    // The BIP44 path.
    bip44: {
      // You can only set the coin type of BIP44.
      // 'Purpose' is fixed to 44.
      coinType: config.coinType,
    },
    // Bech32 configuration to show the address to user.
    // This field is the interface of
    // {
    //   bech32PrefixAccAddr: string;
    //   bech32PrefixAccPub: string;
    //   bech32PrefixValAddr: string;
    //   bech32PrefixValPub: string;
    //   bech32PrefixConsAddr: string;
    //   bech32PrefixConsPub: string;
    // }
    bech32Config: {
      bech32PrefixAccAddr: config.bech32prefix,
      bech32PrefixAccPub: config.bech32prefix + "pub",
      bech32PrefixValAddr: config.bech32prefix + "valoper",
      bech32PrefixValPub: config.bech32prefix + "valoperpub",
      bech32PrefixConsAddr: config.bech32prefix + "valcons",
      bech32PrefixConsPub: config.bech32prefix + "valconspub"
    },
    // List of all coin/tokens used in this chain.
    currencies: [{
      // Coin denomination to be displayed to the user.
      coinDenom: config.displayedDenom,
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: config.coinDenom,
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: config.coinDecimals,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    }],
    // List of coin/tokens used as a fee token in this chain.
    feeCurrencies: [{
      // Coin denomination to be displayed to the user.
      coinDenom: config.displayedDenom,
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: config.coinDenom,
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: config.coinDecimals,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    }],
    // (Optional) The number of the coin type.
    // This field is only used to fetch the address from ENS.
    // Ideally, it is recommended to be the same with BIP44 path's coin type.
    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
    // So, this is separated to support such chains.
    coinType: config.coinType,
    // (Optional) This is used to set the fee of the transaction.
    // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
    // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
    // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
    gasPriceStep: config.gasPrices
  });
}

function convertURookBalance(val: string): number {
    const number = parseInt(val, 10)
    return number/(10**config.coinDecimals)
}