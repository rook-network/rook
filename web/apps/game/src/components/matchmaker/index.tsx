import styles from './matchmaker.module.less';
import React from 'react'
import Card from '../card'
import { Mode } from '../../codec/rook/matchmaker/matchmaker'
import { Config } from '../../codec/rook/game/game'

// export interface MMState {

// }

// export interface MMProps {

// }

export interface MMState {
  status: Status
  mode: Mode
}

type Status = 'home' | 'find' | 'host' | 'join' | 'room' | 'mode'

class Matchmaker extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
      status: 'home'
    }
  }

  hostGame() {
    alert("hosting game")
  }

  joinGame() {
    alert("joining game")
  }

  findGame() {
    alert("finding game")
  }

  render() {
    return (
      <Card>
        <table className={styles.table}>
          <tr>
            <td className={styles.cell} onClick={this.findGame}>
              Find
              <p style={{fontSize: "14px", fontWeight: 400}}>a public game</p>
            </td>
            <td className={styles.cell} onClick={this.hostGame}>
              Host
              <p style={{fontSize: "14px", fontWeight: 400}}>your own custom game</p>
            </td>
            <td className={styles.cell} onClick={this.joinGame}>
              Join
              <p style={{fontSize: "14px", fontWeight: 400}}>a selected game</p>
            </td>
          </tr>
        </table>
      </Card>
    );
  }
}

export default Matchmaker;
