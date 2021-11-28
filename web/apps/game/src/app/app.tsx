import React from 'react';
import './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider, GameProvider, keplrEnabled } from '../components/provider';
import { IndexedMode, Room } from '../codec/rook/matchmaker/matchmaker'
import { Account } from '../components/account'
import { NotConnectedCard, ErrorCard, LoadingCard } from '../components/card'
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
  loadingMsg?: string
  error?: Error
}

class App extends React.Component<any, AppState> {
  mainProvider: Provider | null = null
  playerProvider: GameProvider | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      modes: [],
      address: "",
      balance: 0,
      gameID: new Long(0),
      loadingMsg: "Connecting to Rook account..."
    }
    this.connectWallet = this.connectWallet.bind(this)
    this.setGame = this.setGame.bind(this)
    this.findGame = this.findGame.bind(this)
    this.leaveGame = this.leaveGame.bind(this)
  }

  async componentDidMount() {
    // NOTE: we need to add a timeout because else this fails if we do this straight away
    if (keplrEnabled()) {
      setTimeout(async () => {
        try {
          await this.connectWallet()
        } catch (err) {
          console.log(err)
        }
      }, 100)
    }
  }

  async connectWallet() {
    if (this.mainProvider) 
      return
    try {
      this.setState({ loadingMsg: "Connecting to Rook account..."})
      this.mainProvider = await Provider.connect()
      this.setState({ loadingMsg: "Setting up player account..."})
      this.playerProvider = await GameProvider.connect(this.mainProvider)
    } catch (err) {
      console.error(err)
      this.setState({ error: err as Error })
      return
    }
    setTimeout(async () => {
      if (this.state.modes.length === 0 && this.mainProvider) {
        console.log("retrying....")
        const resp = await this.mainProvider.matchmaker.query.Modes({})
        const balance = await this.mainProvider.getBalance()
        this.setState({ 
          modes: resp.modes,
          balance: balance
        })
      }
    }, 3000) // 3 seconds
    const resp = await this.mainProvider.matchmaker.query.Modes({})
    const address = this.mainProvider.getAddress()
    const balance = await this.mainProvider.getBalance()
    this.setState({
      modes: resp.modes,
      address: address,
      balance: balance,
    })
    await this.findGame()
  }

  async findGame() {
    if (!this.mainProvider || !this.playerProvider)
      return

    this.setState({ loadingMsg: "Searching for existing games or rooms..."})

    try {
      const resp = await this.playerProvider.query.GameByPlayer({player: this.state.address})
      this.setState({
        gameID: resp.id,
        loadingMsg: undefined
      })
    } catch (err) {
      console.log("no current game")
      this.setState({ loadingMsg: undefined })
    }
  }

  setGame(gameID: Long): void {
    this.setState({ 
      gameID: gameID
    })
  }

  leaveGame(): void {
    this.setState({
      gameID: new Long(0)
    })
  }

  render() {
    const testnetLabel = (
      <div style={{ position: "absolute", right: "30px", top: "30px", fontFamily: "Arial, Helvetica, sans-serif", fontWeight: "bold" }}>
          TESTNET
      </div>
    )
    let isConnected = false
    const header = (
      <>
        { testnetLabel }
        <Account 
            address={this.state.address} 
            balance={this.state.balance} 
            isConnected={isConnected} 
        />
      </>
    )

    if (!keplrEnabled()) {
      return ( <>
        { header }
        <NotConnectedCard connectFn={this.connectWallet} /> 
      </> )
    }

    if (this.state.error) {
      return ( <>
        { header }
        <ErrorCard error={this.state.error.message} />
      </> )
    }

    if (this.state.loadingMsg) {
      return ( <>
        { header }
        <LoadingCard message={this.state.loadingMsg} />
      </> )
    }
    
    if (!this.mainProvider || !this.playerProvider) {
      return ( <>
        { header }
        <LoadingCard message="Connecting to Rook account..."/>
      </> )
    }

    isConnected = this.mainProvider !== null
    return (
      <>
        <Account 
          address={this.state.address} 
          balance={this.state.balance} 
          isConnected={isConnected} 
        />
        { testnetLabel }
        { this.state.gameID.eq(0) ?
          <Matchmaker 
            modes={this.state.modes} 
            provider={this.mainProvider.matchmaker} 
            address={this.state.address}
            gameFn={this.setGame}
          /> :
          <Game 
            gameID={this.state.gameID}
            provider={this.playerProvider}
            address={this.state.address}
            quit={this.leaveGame}
          />
        }
      </>
    );
  }
}

export default App;
