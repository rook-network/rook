import React from 'react';
import styles from './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';
import { IndexedMode } from '../codec/rook/matchmaker/matchmaker'

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

export interface AppState {
  modes: IndexedMode[]
}

class App extends React.Component<any,AppState> {
  provider: Provider | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      modes: [],
    }
  }

  async componentDidMount() {
    this.provider = await Provider.connect()
    const resp = await this.provider.matchmaker.query.Modes({})
    console.log(resp.modes)
    this.setState({
      modes: resp.modes
    })
  }

  render() {
    const isConnected = this.provider !== null
    return (
      <div>
        { isConnected && <Matchmaker modes={this.state.modes} provider={this.provider!.matchmaker} address={this.provider!.getAddress()}/> }
      </div>
      // <Game />
    );
  }
}

export default App;
