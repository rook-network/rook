import React from 'react';
import { Button } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons'

interface Account {
    address: string
}

interface IWalletProps {
    style?: any
}

interface IWalletState {
    isConnected: boolean;
    accounts: Account[];
}

export class Wallet extends React.Component<IWalletProps, IWalletState> {
    constructor(props: IWalletProps) {
        super(props);

        this.state = {
            isConnected: false,
            accounts: [],
        }

        if (this.keplrEnabled()) {
            this.connectWallet()
        }
    }

    keplrEnabled = () => {
        return window.getOfflineSigner && window.keplr
    }

    connectWallet = async () => {
        if (!window.getOfflineSigner || !window.keplr) {
            alert("please install keplr extension")
        } 

        if (window.keplr.experimentalSuggestChain) {
            try {
                await window.keplr.experimentalSuggestChain({
                    // Chain-id of the Cosmos SDK chain.
                    chainId: "rook-single",
                    // The name of the chain to be displayed to the user.
                    chainName: "Rook",
                    // RPC endpoint of the chain.
                    rpc: "http://localhost:26657",
                    // REST endpoint of the chain.
                    rest: "http://localhost:1317",
                    // Staking coin information
                    stakeCurrency: {
                        // Coin denomination to be displayed to the user.
                        coinDenom: "rook",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "urook",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
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
                        coinType: 118,
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
                        bech32PrefixAccAddr: "rook",
                        bech32PrefixAccPub: "rookpub",
                        bech32PrefixValAddr: "rookvaloper",
                        bech32PrefixValPub: "rookvaloperpub",
                        bech32PrefixConsAddr: "rookvalcons",
                        bech32PrefixConsPub: "rookvalconspub"
                    },
                    // List of all coin/tokens used in this chain.
                    currencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "rook",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "urook",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // List of coin/tokens used as a fee token in this chain.
                    feeCurrencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "rook",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "urook",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 6,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                    }],
                    // (Optional) The number of the coin type.
                    // This field is only used to fetch the address from ENS.
                    // Ideally, it is recommended to be the same with BIP44 path's coin type.
                    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
                    // So, this is separated to support such chains.
                    coinType: 118,
                    // (Optional) This is used to set the fee of the transaction.
                    // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
                    // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
                    // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
                    gasPriceStep: {
                        low: 0.01,
                        average: 0.025,
                        high: 0.04
                    }
                });
            } catch {
                alert("Failed to suggest the chain");
            }
        } else {
            alert("Please use the recent version of keplr extension");
        }

        const chainId = "rook-single";
        await window.keplr.enable(chainId)

        const offlineSigner = window.getOfflineSigner(chainId)

        const accounts = await offlineSigner.getAccounts()

        this.setState({
            isConnected: true,
            accounts: accounts
        })
    }

    render() {
        if (!this.state.isConnected) {
            return (
                <Button type="primary" style={this.props.style} onClick={this.connectWallet}>Connect</Button>
            )
        }

        return (
            <div style={this.props.style}>
                <CreditCardOutlined />
                <span style={{margin: "5px"}}>{this.state.accounts[0].address.substring(0, 12)}...</span>
            </div>
        )
    }
}