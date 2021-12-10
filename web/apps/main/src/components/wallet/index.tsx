import styles from "./wallet.module.less"
import React from 'react';
import { Button } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons'
import { keplrEnabled } from '../provider'

export interface WalletInfo {
    chainID: string
    address: string
    balance: number
    height: number
}

interface IWalletProps {
    wallet: WalletInfo
    connect: () => void
}

interface IWalletState {
    error?: string
}

class Wallet extends React.Component<IWalletProps, IWalletState> {
    constructor(props: IWalletProps) {
        super(props);
        this.state = {
            error: undefined,
        }
        this.toggle = this.toggle.bind(this)
        this.tryConnect = this.tryConnect.bind(this)
    }

    toggle() {
        if (this.props.wallet.address === "") return
        const address = document.getElementById("wallet_address")
        if (address === null) return
        const chainInfo = document.getElementById("chain_info")
        if (chainInfo !== null) {
            if (chainInfo.style.display === "none") {
                chainInfo.style.display = "block"
                address.innerText = this.props.wallet.address
                navigator.clipboard.writeText(this.props.wallet.address)
            } else {
                chainInfo.style.display = "none"
                address.innerText = this.props.wallet.address.substring(4, 12) + "..."
            }
        }
    }

    async tryConnect() {
        try { 
            if (!keplrEnabled()) {
                // if this was already the error then the second click takes
                // the user to the keplr page
                if (this.state.error === "Please Install Keplr") {
                    window.location.href = "https://www.keplr.app/"
                } else {
                    this.setState({ error: "Please Install Keplr"})
                }
            } else {
                await this.props.connect()
            }
        } catch (e: any) {
            const err = e.message as string
            
            if (err.includes("Failed to fetch")) {
                this.setState({ 
                    error: "Blockchain Unavailable"
                })
            } else {
                console.error(err)
            }
        }
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    <Button type="primary" onClick={this.tryConnect}>{this.state.error}</Button>
                </div>
            )
        }

        if (this.props.wallet.address === "") {
            return (
                <div>
                    <Button type="primary" onClick={this.tryConnect}>No Wallet Connected</Button>
                </div>
            )
        }
        return (
            <div className={styles.wallet} onClick={this.toggle}>
                <table>
                    <td>
                        <CreditCardOutlined />
                        <span id="wallet_address" style={{marginLeft: "8px"}}>{this.props.wallet.address.substring(4, 12)}...</span>
                        <p style={{textAlign: "right", fontWeight: "bold", marginBottom: "0px"}}>
                            {this.props.wallet.balance.toString()} ROOK
                        </p>
                    </td>
                    <td id="chain_info" style={{display: "none", paddingLeft: "10px", fontSize: "12px", borderLeft: "2px solid black", marginLeft: "10px"}}>
                        Chain: <strong>{this.props.wallet.chainID}</strong> 
                        <br />
                        Height: <strong>{this.props.wallet.height.toString()}</strong>
                    </td>
                </table>
            </div>
        )
    }
}

export default Wallet
