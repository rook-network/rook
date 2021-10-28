import React from 'react';
import './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';
import { IndexedMode } from '../codec/rook/matchmaker/matchmaker'
import { Account } from '../components/account'
import { NotConnectedCard } from '../components/card'


declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

export interface AppState {
  modes: IndexedMode[]
  address: string
  balance: number
}

class App extends React.Component<any, AppState> {
  provider: Provider | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      modes: [],
      address: "",
      balance: 0,
    }
    this.connectWallet = this.connectWallet.bind(this)
  }

  async componentDidMount() {
    try {
      await this.connectWallet()
    } catch (err) {
      console.log(err)
    }
  }

  async connectWallet() {
    this.provider = await Provider.connect()
    const resp = await this.provider.matchmaker.query.Modes({})
    const address = this.provider.getAddress()
    const balance = await this.provider.getBalance()
    this.setState({
      modes: resp.modes,
      address: address,
      balance: balance,
    })
  }

  render() {
    const isConnected = this.provider !== null
    return (
      <div>
        <Account 
          address={this.state.address} 
          balance={this.state.balance} 
          isConnected={isConnected} 
        />
        { isConnected ?
          <Matchmaker 
            modes={this.state.modes} 
            provider={this.provider!.matchmaker} 
            address={this.provider!.getAddress()}
          /> :
          <NotConnectedCard connectFn={this.connectWallet} />
        }
      </div>
      // <Game />
    );
  }
}

export default App;
