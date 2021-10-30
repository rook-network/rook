import { BroadcastTxResponse, SigningStargateClient, StdFee, QueryClient, createProtobufRpcClient, isBroadcastTxSuccess, BroadcastTxSuccess } from "@cosmjs/stargate"
import { SocketWrapper, SocketWrapperMessageEvent, SocketWrapperErrorEvent } from '@cosmjs/socket'
import { Tendermint34Client, Event } from '@cosmjs/tendermint-rpc'
import config from "../../config"
import { Registry } from '@cosmjs/stargate/node_modules/@cosmjs/proto-signing'
import { 
    MsgFind, MsgHost, MsgJoin, MsgLeave, MsgAddMode, MsgRemoveMode, Msg as IMatchmakerMsgClient, 
    MsgFindResponse, MsgHostResponse, MsgJoinResponse, MsgLeaveResponse, MsgAddModeResponse, MsgRemoveModeResponse
} from '../../codec/rook/matchmaker/tx'
import { QueryClientImpl as MatchmakerQueryClient} from '../../codec/rook/matchmaker/query'
import { QueryClientImpl as GameQueryClient } from '../../codec/rook/game/query'
import _m0 from "protobufjs/minimal";
import { 
    Msg as IGameMsgClient, MsgCreate, MsgBuild, MsgMove, MsgChangeParams,
    MsgCreateResponse, MsgBuildResponse, MsgMoveResponse, MsgChangeParamsResponse
} from '../../codec/rook/game/tx'

import Long from 'long';

const typeMsgFind = "/rook.matchmaker.MsgFind"
const typeMsgHost = "/rook.matchmaker.MsgHost"
const typeMsgJoin = "/rook.matchmaker.MsgJoin"
const typeMsgLeave = "/rook.matchmaker.MsgLeave"
const typeMsgAddMode = "/rook.matchmaker.MsgAddMode"
const typeMsgRemoveMode = "/rook.matchmaker.MsgRemoveMode" 
const typeMsgCreate = "/rook.game.MsgCreate"
const typeMsgBuild = "/rook.game.MsgBuild"
const typeMsgMove = "/rook.game.MsgMove"
const typeMsgChangeParams = "/rook.game.MsgChamgeParams"


const eventTypeNewRoom     = "new_room"
const eventTypeRoomReady   = "room_ready"
const eventTypeClosingRoom = "closing_room"
const eventTypeJoinedRoom  = "joined_room"

const rookRegistry = new Registry([
    // matchmaker types
    [typeMsgFind, MsgFind],
    [typeMsgHost, MsgHost],
    [typeMsgJoin, MsgJoin],
    [typeMsgLeave, MsgLeave],
    [typeMsgAddMode, MsgAddMode],
    [typeMsgRemoveMode, MsgRemoveMode],
    // game types
    [typeMsgCreate, MsgCreate],
    [typeMsgBuild, MsgBuild],
    [typeMsgMove, MsgMove],
    [typeMsgChangeParams, MsgChangeParams]
])

const defaultFee: StdFee = {
    amount: [
        { 
            denom: config.coinDenom,
            amount: "0",
        }
    ],
    gas: "100000"
}

export class MatchmakerProvider {
    public query: MatchmakerQueryClient
    public tx: IMatchmakerMsgClient

    constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new MatchmakerQueryClient(protoRpcClient)
        // FIXME: The msg client sends a query instead of broadcasting a tx
        // this.tx = new MsgClientImpl(protoRpcClient)
        this.tx = new MatchmakerMsgClient(client, address)
    }
}

export class MatchmakerMsgClient implements IMatchmakerMsgClient {
    private client: SigningStargateClient
    private address: string
    private updateHeight?: (height: number) => void

    constructor(client: SigningStargateClient, address: string, updateHeight?: (height:number) => void) {
        this.client = client
        this.address = address
        this.updateHeight = updateHeight
    }

    private async send(request: any, typeUrl: string): Promise<BroadcastTxSuccess> {
        const resp = await this.client.signAndBroadcast(
            this.address,
            [{
                typeUrl: typeUrl,
                value: request
            }], 
            defaultFee 
        )
        if (this.updateHeight)
            this.updateHeight(resp.height)

        if (!isBroadcastTxSuccess(resp))
            throw new Error(`Transaction failed with code (${resp.code}): ${resp.rawLog}`)

        return resp
    }

    async Host(request: MsgHost): Promise<MsgHostResponse> {
        const resp = await this.send(request, typeMsgHost)
        
        // FIXME: resp.data is always nil when we should be getting the response from
        // th msg server. Instead we parse the events and build the response from them.
        if (resp.data !== undefined) {
            return MsgHostResponse.decode(new _m0.Reader(resp.data[0]!.data))
        }

        if (resp.rawLog !== undefined) {
            const events = JSON.parse(resp.rawLog)[0].events as Event[]
            for (const event of events) {
                if (event.type === eventTypeJoinedRoom) {
                    if (event.attributes[0].value.toString() === this.address) {
                        return {
                            roomId: Long.fromString(event.attributes[1].value.toString())
                        } as MsgHostResponse
                    }
                }
            }
            throw new Error("emmitted transaction events didn't include roomID for sender")
        }
        throw new Error("Unable to parse transaction response: " + JSON.stringify(resp))
    }

    async Join(request: MsgJoin): Promise<MsgJoinResponse> {
        await this.send(request, typeMsgJoin)
        return {}
    }

    async Find(request: MsgFind): Promise<MsgFindResponse> {
        const resp = await this.send(request, typeMsgFind)

        // FIXME: resp.data is always nil when we should be getting the response from
        // th msg server. Instead we parse the events and build the response from them.
        if (resp.data !== undefined) { 
            return MsgFindResponse.decode(new _m0.Reader(resp.data[0]!.data))
        }

        if (resp.rawLog !== undefined) {
            const events = JSON.parse(resp.rawLog)[0].events as Event[]
            console.log(events)
            for (const event of events) {
                if (event.type === eventTypeJoinedRoom) {
                    if (event.attributes[0].value.toString() === this.address) {
                        return {
                            roomId: Long.fromString(event.attributes[1].value.toString())
                        } as MsgHostResponse
                    }
                }
            }
            throw new Error("emmitted transaction events didn't include roomID for sender")
        }
        throw new Error("Unable to parse transaction response: " + JSON.stringify(resp))
    }

    async Leave(request: MsgLeave): Promise<MsgLeaveResponse> {
        await this.send(request, typeMsgLeave)
        return {}
    }

    async AddMode(request: MsgAddMode): Promise<MsgAddModeResponse> {
        await this.send(request, typeMsgAddMode)
        // TODO: we should emit an event and parse it correct to have a return value.
        // We will return a hard-coded value for now 
        return { 
            id: 0,
        }
    }

    async RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse> {
        await this.send(request, typeMsgRemoveMode)
        return {}
    }
}

export class GameProvider {
    public query: GameQueryClient
    public tx: IGameMsgClient

    constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new GameQueryClient(protoRpcClient)
        this.tx = new GameMsgClient(client, address)
    }
}

export class GameMsgClient implements IGameMsgClient {
    private client: SigningStargateClient
    private readonly address: string

    constructor(client: SigningStargateClient, address: string) {
        this.client = client
        this.address = address
    }

    private async send(request: any, typeUrl: string) {
        return await this.client.signAndBroadcast(
            this.address,
            [{ typeUrl: typeUrl, value: request}],
            defaultFee
        )
    }

    async Move(request: MsgMove): Promise<MsgMoveResponse> {
        const resp = await this.send(request, typeMsgMove)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgMoveResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async Build(request: MsgBuild): Promise<MsgBuildResponse> {
        const resp = await this.send(request, typeMsgBuild)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgBuildResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async Create(request: MsgCreate): Promise<MsgCreateResponse> {
        const resp = await this.send(request, typeMsgCreate)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgCreateResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse> {
        const resp = await this.send(request, typeMsgChangeParams)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgChangeParamsResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }
}

export class Provider {
    private client: SigningStargateClient
    private querier: QueryClient
    private address: string

    public socket: SocketWrapper
    public readonly matchmaker: MatchmakerProvider
    public readonly game: GameProvider
    public readonly chainID: string

    constructor(client: SigningStargateClient, querier: QueryClient, address: string) {
        this.client = client
        this.querier = querier
        this.address = address
        this.chainID = config.chainID
        this.matchmaker = new MatchmakerProvider(this.querier, this.client, this.address)
        this.game = new GameProvider(this.querier, this.client, this.address)
        this.socket = new SocketWrapper(
            config.wsEndpoint, 
            (event: SocketWrapperMessageEvent) => { 
                const parsedEvent = JSON.parse(event.data)
                console.log(parsedEvent)
            },
            (event: SocketWrapperErrorEvent) => { console.error(event)}
        )
        // connect the socket
        this.socket.connect()
    }

    public static async connect(): Promise<Provider> {
        if (!keplrEnabled() || !window.keplr.experimentalSuggestChain) {
            throw new Error("keplr is not connected. Please install the extension first")
        }

        console.log("attempting to connect with keplr wallet")

        try { 
            suggestChainToKeplr()
        } catch {
            throw new Error("unable to suggest rook chain to keplr")
        }

        window.keplr.enable(config.chainID)

        const offlineSigner = window.keplr.getOfflineSigner(config.chainID)

        const client = await SigningStargateClient.connectWithSigner(
            config.rpcEndpoint,
            offlineSigner,
            { registry: rookRegistry }
        )

        const tmClient = await Tendermint34Client.connect(config.rpcEndpoint)
        const querier = QueryClient.withExtensions(tmClient)

        const accounts = await offlineSigner.getAccounts()
        if (accounts.length === 0)
            throw new Error("keplr has no accounts")

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

    async findGame(mode: number): Promise<BroadcastTxResponse> {
        if (this.client === null || this.address === null)
            throw new Error("client not initialized")

        const message = {
            typeUrl: typeMsgFind,
            value: {
                creator: this.address,
                mode: mode,
            } as MsgFind,
        }
        const fee: StdFee = {
            amount: [{
                denom: config.coinDenom,
                amount: "0",
            }],
            gas: "500000"
        }
        return await this.client.signAndBroadcast(this.address, [message], fee)
    }

    async joinGame(room: number): Promise<BroadcastTxResponse> {
        if (this.client === null || this.address === null)
            throw new Error("client not initialized")

        const message = {
            typeUrl: typeMsgJoin,
            value: {
                creator: this.address,
                roomId: new Long(room),
            } as MsgJoin,
        }
        const fee: StdFee = {
            amount: [{
                denom: config.coinDenom,
                amount: "0",
            }],
            gas: "500000"
        }
        return await this.client.signAndBroadcast(this.address, [message], fee)
    }

    async hostGame(mode: number, invitees: string[], publicGame: boolean, scheduled?: Date): Promise<BroadcastTxResponse> {
        if (this.client === null || this.address === null)
            throw new Error("client not initialized")

        const message = {
            typeUrl: typeMsgHost,
            value: {
                creator: this.address,
                // TODO: currently players that want to host the game can't use a custom mode. 
                modeId: mode,
                invitees: invitees,
                public: publicGame,
                scheduled: scheduled,
            } as MsgHost,
        }
        const fee = {
            amount: [{
                denom: config.coinDenom,
                amount: "0",
            }],
            gas: "500000"
        }
        return await this.client.signAndBroadcast(this.address, [message], fee)
    }

    async leaveRoom(room: number): Promise<BroadcastTxResponse> {
        if (this.client === null || this.address === null)
            throw new Error("client not initialized")

        const message = {
            typeUrl: typeMsgLeave,
            value: {
                creator: this.address,
                roomId: new Long(room),
            } as MsgLeave,
        }
        const fee: StdFee = {
            amount: [{
                denom: config.coinDenom,
                amount: "0",
            }],
            gas: "500000"
        }
        return await this.client.signAndBroadcast(this.address, [message], fee)
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