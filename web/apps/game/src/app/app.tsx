import React from 'react';
import styles from './app.module.less';
import Matchmaker from '../components/matchmaker';
import { Provider } from '../components/provider';

declare global {
    interface Window { getOfflineSigner: any; keplr: any; }
}

class App extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      provider: new Provider()
    }
  }

  render() {
    return (
      <Matchmaker />
      // <Game />
    );
  }
}

export default App;
