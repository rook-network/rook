import styles from './matchmaker.module.less';
import React from 'react'
import Card, { LoadingCard } from '../card'
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
  loading?: string
}

type Status = 'home' | 'find' | 'host' | 'join' | 'room' | 'mode'

class Matchmaker extends React.Component<MMProps, MMState> {
  checkRoom = false

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

  async componentDidMount() {
    if (!this.checkRoom) {
      const resp = await this.props.provider.query.Player({player: this.props.address})
      if (resp.room) {
        console.log("player is currently in a room")
        this.setState({
          status: 'room',
          room: resp.room.room,
          roomID: resp.room.roomId,
        })
      } else {
        console.log("player is not currently in a room")
      }
      this.checkRoom = true
    }
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
      try {
        this.setState({ loading: "Finding Game..."})
        const resp = await this.props.provider.tx.Find({
          player: this.props.address,
          mode: this.props.modes[0].modeId
        } as MsgFind)
        this.setState({
          mode: this.props.modes[0].mode,
          roomID: resp.roomId,
          status: "room",
          loading: undefined
        })
        console.log(resp)
        await this.props.provider.subscribeToRoom(resp.roomId, (room: Room): void => {
          this.setState({
            room: room,
          })
        }, (id: Long) => {
          console.log("starting game: " + id)
        })
      } catch (err) {
        console.error(err)
      }
    } else {
      // TODO: the user must select which mode they are interested in playing. At the moment,
      // we have just one mode so this should never happen
      this.setState({
        status: 'mode',
      })
    }
  }

  render() {
    if (this.state.loading) {
      return <LoadingCard message={this.state.loading} />
    }

    if (this.props.modes.length === 0) {
      return <LoadingCard message="Loading modes..."/>
    }

    switch (this.state.status) {
      case 'home':
        return <HomeComponent find={this.findGame} host={this.hostGame} join={this.joinGame} />
      case 'room':
        return <RoomComponent id={this.state.roomID} room={this.state.room} />
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
    <Card>
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
    </Card>
  )
}

interface RoomProps {
  id: Long
  room?: Room
}

export const RoomComponent = (props: RoomProps) => {
  if (!props.room) {
    if (props.id.gt(0)) {
      const msg = "Joining Room " + props.id.toString() + "..."
      return (
        <LoadingCard
          message={msg}
        />
      )
    }

    return (
      <LoadingCard
          message="Finding Room..."
      />
    )
  }

  const minSpots = props.room.quorum - props.room.players.length
  return (
    <Card>
      <div>
        <h3>{ props.room.public ? "Public" : "Private" } Room {props.id.toString()}</h3>
        <p style={{ textAlign: "left" }}>Players:</p>
        <ul>
          { props.room.players.map((player, index) => 
            <li key={index} className={styles.player}>{player}</li>
          )}
        </ul>
        { props.room.pending.length > 0 &&
          <div>
            <p style={{ textAlign: "left" }}>Invited:</p>
            <ul>
              { props.room.pending.map((player, index) => 
                <li key={index} className={styles.player}>{player}</li>
              )}
            </ul>
          </div>
        }
        { minSpots === 1 &&
        <p className={styles.footer}>Waiting for 1 more player...</p>
        }
        { minSpots > 1 &&
        <p className={styles.footer}>Waiting for {minSpots} players...</p>
        }
      </div>
    </Card>
  )
}