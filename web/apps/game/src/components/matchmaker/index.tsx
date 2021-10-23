import styles from './matchmaker.module.less';
import React from 'react'
import Card from '../card'
import { Mode, IndexedMode } from '../../codec/rook/matchmaker/matchmaker'
import { MsgFind } from '../../codec/rook/matchmaker/tx'
import { MatchmakerProvider } from "../provider"

export interface MMProps {
  provider: MatchmakerProvider
  modes: IndexedMode[]
  address: string
}

export interface MMState {
  status: Status
  mode?: Mode
}

type Status = 'home' | 'find' | 'host' | 'join' | 'room' | 'mode'

class Matchmaker extends React.Component<MMProps, MMState> {
  constructor(props: MMProps) {
    super(props)
    this.state = {
      status: 'home'
    }
    
    this.hostGame = this.hostGame.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.findGame = this.findGame.bind(this)
  }

  hostGame() {
    alert("hosting game")
  }

  joinGame() {
    alert("joining game")
  }

  async findGame() {
    // if there is only one mode then we use that one
    if (this.props.modes.length === 1) {
      this.setState({
        mode: this.props.modes[0].mode
      })
      const resp = await this.props.provider.tx.Find({
        creator: this.props.address,
        mode: this.props.modes[0].id
      } as MsgFind)
      console.log(resp)
    }
    
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
