import styles from './matchmaker.module.less';
import React from 'react'
import Card from '../card'
import { Mode, IndexedMode, Room } from '../../codec/rook/matchmaker/matchmaker'
import { MsgFind } from '../../codec/rook/matchmaker/tx'
import { MatchmakerProvider } from "../provider"
import Long from 'long';

export interface MMProps {
  provider: MatchmakerProvider
  modes: IndexedMode[]
  address: string
}

export interface MMState {
  status: Status
  roomID: Long
  room?: Room
  mode?: Mode
}

type Status = 'home' | 'find' | 'host' | 'join' | 'room' | 'mode'

class Matchmaker extends React.Component<MMProps, MMState> {
  constructor(props: MMProps) {
    super(props)
    this.state = {
      status: 'home',
      roomID: new Long(0)
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
      const resp = await this.props.provider.tx.Find({
        creator: this.props.address,
        mode: this.props.modes[0].id
      } as MsgFind)
      this.setState({
        mode: this.props.modes[0].mode,
        roomID: resp.roomId
      })
    }
    
    alert("finding game")
  }

  render() {
    switch (this.state.status) {
      case 'home':
        return (
          <Card>
            <HomeComponent find={this.findGame} host={this.hostGame} join={this.joinGame} />
          </Card>
        )
      case 'room':
        return (
          <Card>
            <RoomComponent id={this.state.roomID} />
          </Card>
        )
      default:
        return (
          <Card>
            Error: Unknown matchmaker state: {this.state.status}
          </Card>
        )
    }
  }
}

export default Matchmaker;

interface HomeProps {
  host: () => void,
  find: () => void,
  join: () => void,
}

export const HomeComponent = (props: HomeProps) => {
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td className={styles.cell} onClick={props.find}>
            Find
            <p style={{fontSize: "14px", fontWeight: 400}}>a public game</p>
          </td>
          <td className={styles.cell} onClick={props.host}>
            Host
            <p style={{fontSize: "14px", fontWeight: 400}}>your own game</p>
          </td>
          <td className={styles.cell} onClick={props.join}>
            Join
            <p style={{fontSize: "14px", fontWeight: 400}}>a selected game</p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

interface RoomProps {
  id: Long
  // count: number,
  // total: number,
  // quorum: number
}

export const RoomComponent = (props: RoomProps) => {
  return (
    <div>
      Room {props.id}
    </div>
  )
}