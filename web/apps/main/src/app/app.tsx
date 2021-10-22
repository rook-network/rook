import React from 'react';
import { ReactComponent as Logo } from './tower.svg';
import { ReactComponent as Snapshot1 } from './snapshot-1.svg';
import { ReactComponent as Snapshot2 } from './snapshot-2.svg';
import { ReactComponent as Snapshot3 } from './snapshot-3.svg';
import Wallet, { WalletInfo } from '../components/wallet/'
import { Provider } from '../components/provider'
import { isBroadcastTxSuccess } from '@cosmjs/stargate';
import { Layout, Menu, Typography, Row, Col, Card, Input, Button } from "antd";

const { Header, Content } = Layout
const { Title, Text } = Typography

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

interface IAppState { 
  wallet: WalletInfo
}

// eslint-disable-next-line @typescript-eslint/ban-types
class App extends React.Component<{}, IAppState> {
  provider: Provider

  constructor(props = {}) {
    super(props)
    this.provider = new Provider()
    this.state = {
      wallet: {
        chainID: this.provider.chainID,
        address: "",
        height: 0,
        balance: 0,
      }
    }
    this.claimTokens = this.claimTokens.bind(this)
    this.connectWallet = this.connectWallet.bind(this)
  }

  async componentDidMount() {
    this.connectWallet()
  }

  redirectToDocs() {
    window.location.href = "https://arcane-systems.github.io/rook";
  }

  async claimTokens() {
    const resp = await this.provider.claimTokens()
    if (resp === null) {
      console.log("node wasn't connected")
      return
    }
    if (isBroadcastTxSuccess(resp)) {
      console.log("successfully claimed airdrop")
      const balance = await this.provider.getBalance()
      this.setState({
        wallet: {
          chainID: this.provider.chainID,
          height: resp.height,
          address: this.provider.getAddress(),
          balance: balance
        }
      })
    } else {
      console.log("failed to claim airdrop: " + resp.rawLog)
      this.setState({
        wallet: {
          chainID: this.state.wallet.chainID,
          height: resp.height,
          address: this.provider.getAddress(),
          balance: this.state.wallet.balance
        }
      })
    }
  }

  async connectWallet() {
    const address = await this.provider.connectWallet()
    if (address == null) return 
    const balance = await this.provider.getBalance()
    const height = await this.provider.getHeight()
    this.setState({  
      wallet: {
        chainID: this.provider.chainID,
        address: address,
        balance: balance,
        height: height,
      }
    }) 
  }

  render() {
    return (
      <Layout>
        <Header style={{ margin: "20px" }}>
            <table style={{ width: "100%", verticalAlign: "middle" }}>
            <td>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Logo height="32" width="32"/>
                <Title level={3} style={{ margin: "10px"}}>Rook</Title>
                </div>
            </td>
            <td style={{ float: "right" }}>
                <Wallet wallet={this.state.wallet} connect={this.connectWallet}></Wallet>
            </td>
            </table>
        </Header>
        <Content style={{ margin: "30px" }}>
            <Row justify="space-around">
            <Col span={6}>
                <Card>
                <Title>Claim</Title>
                <Text type="secondary">Start your journey as an ATOM tokenholder by claiming your first airdrop</Text>
                <br />
                <br />
                <Button type="primary" style={{float: "right"}} onClick={this.claimTokens}>Claim</Button>
                <br />
                <br />
                <Snapshot1 height="40vh" width="100%" style={{margin: '10px'}}/>
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                <Snapshot2 height="40vh" width="100%" style={{margin: '10px'}}/>
                <Title>Learn</Title>
                <Text type="secondary">Peek into the docs to learn how to play</Text>
                {/* <Text type="secondary">Get a feel for the game by entering the Dojo</Text> */}
                <br />
                <br />
                <Button type="primary" style={{float: "right"}} onClick={this.redirectToDocs}>Enter</Button>
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                <Title>Play</Title>
                <Text type="secondary">Try out the alpha version</Text>
                <br />
                <br />
                <Button type="primary" style={{float: "right"}} disabled>Coming Soon</Button>
                <br />
                <br />
                <Snapshot3 height="40vh" width="100%" style={{margin: '10px'}}/>
                </Card>
            </Col>
            </Row>
        </Content>
      </Layout>    
    ); 
  }
}

export default App;