import React from 'react';
import './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';
import { IndexedMode, Room } from '../codec/rook/matchmaker/matchmaker'
import { Account } from '../components/account'
import { NotConnectedCard, ErrorCard } from '../components/card'
import { ErrKeplrNotEnabled } from '../components/provider/errors';


declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

export interface AppState {
  modes: IndexedMode[]
  address: string
  balance: number
  error?: Error
  viewMode: boolean
}

class App extends React.Component<any, AppState> {
  provider: Provider | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      modes: [],
      address: "",
      balance: 0,
      viewMode: false
    }
    this.connectWallet = this.connectWallet.bind(this)
  }

  async componentDidMount() {
    // NOTE: we need to add a timeout because else this fails if we do this straight away
    setTimeout(async () => {
      try {
        await this.connectWallet()
      } catch (err) {
        console.log(err)
      }
    }, 100)
  }

  async connectWallet() {
    if (this.provider) 
      return
    try {
      this.provider = await Provider.connect()
    } catch (err) {
      console.error(err)
      this.setState({ error: err as Error })
      return
    }
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
    if (this.state.error) {
      return (
        <ErrorCard error={this.state.error.message} />
      )
    }

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
