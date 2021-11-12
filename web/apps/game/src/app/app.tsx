import React from 'react';
import './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';
import { IndexedMode, Room } from '../codec/rook/matchmaker/matchmaker'
import { Account } from '../components/account'
import { NotConnectedCard, ErrorCard } from '../components/card'
import Game from '../components/game'
import Long from 'long'

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

export interface AppState {
  modes: IndexedMode[]
  address: string
  balance: number
  gameID: Long
  error?: Error
}

class App extends React.Component<any, AppState> {
  provider: Provider | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      modes: [],
      address: "",
      balance: 0,
      gameID: new Long(0),
    }
    this.connectWallet = this.connectWallet.bind(this)
    this.setGame = this.setGame.bind(this)
    this.findGame = this.findGame.bind(this)
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
    setTimeout(async () => {
      if (this.state.modes.length === 0 && this.provider) {
        console.log("retrying....")
        const resp = await this.provider.matchmaker.query.Modes({})
        const balance = await this.provider.getBalance()
        this.setState({ 
          modes: resp.modes,
          balance: balance
        })
      }
    }, 3000) // 3 seconds
    const resp = await this.provider.matchmaker.query.Modes({})
    const address = this.provider.getAddress()
    const balance = await this.provider.getBalance()
    this.setState({
      modes: resp.modes,
      address: address,
      balance: balance,
    })
    await this.findGame()
  }

  async findGame() {
    if (!this.provider)
      return

    try {
      const resp = await this.provider.game.query.FindByPlayer({player: this.provider.getAddress()})
      this.setState({
        gameID: resp.id
      })
    } catch (err) {
      console.log("no current game")
    }
  }

  setGame(gameID: Long): void {
    this.setState({ 
      gameID: gameID
    })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorCard error={this.state.error.message} />
      )
    }
    
    if (!this.provider) {
      return (
        <NotConnectedCard connectFn={this.connectWallet} /> 
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
        { this.state.gameID.eq(0) ?
          <Matchmaker 
            modes={this.state.modes} 
            provider={this.provider.matchmaker} 
            address={this.state.address}
            gameFn={this.setGame}
          /> :
          <Game 
            gameID={this.state.gameID}
            provider={this.provider.game}
          />
        }
      </div>
    );
  }
}

export default App;
