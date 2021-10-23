import React from 'react';
import styles from './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

class App extends React.Component {
  provider: Provider | null = null

  // constructor(props: any) {
  //   super(props)
  // }

  async componentDidMount() {
    this.provider = await Provider.connect()
  }

  render() {
    return (
      <Matchmaker />
      // <Game />
    );
  }
}

export default App;
