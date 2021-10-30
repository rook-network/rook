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
      // console.log(resp)
      const roomResp = await this.props.provider.query.Room({ id: resp.roomId })
      // console.log(roomResp.room)
      this.setState({
        mode: this.props.modes[0].mode,
        roomID: resp.roomId,
        status: 'room',
        room: roomResp.room,
      })
    } else {
      // throw new Error("not yet implemented")
      this.setState({
        status: 'mode',
      })
    }
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
            <RoomComponent id={this.state.roomID} room={this.state.room!} />
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
  room: Room
}

export const RoomComponent = (props: RoomProps) => {
  const minSpots = props.room.quorum - props.room.players.length
  return (
    <div>
      <h3>{ props.room.public ? "Public" : "Private" } Room {props.id.toString()}</h3>
      <p style={{ textAlign: "left" }}>Players:</p>
      <ul>
        { props.room.players.map((player, index) => 
          <li className={styles.player}>{player}</li>
        )}
      </ul>
      { minSpots === 1 &&
       <p className={styles.footer}>Waiting for 1 more player...</p>
      }
      { minSpots > 1 &&
       <p className={styles.footer}>Waiting for {minSpots} players...</p>
      }
    </div>
  )
}