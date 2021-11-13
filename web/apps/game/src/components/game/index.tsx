import './game.module.less';
import React from 'react'
import MapComponent from '../map';
import { GameProvider } from "../provider"
import { GameSnapshot } from "../../codec/rook/game/game"
import { Params } from "../../codec/rook/game/config"
import { LoadingCard } from '../card/index'
import Long from 'long';

export interface GameProps {
  gameID: Long
  provider: GameProvider
}

export interface GameState {
  game?: GameSnapshot
  params?: Params
  error?: Error
}

class GameComponent extends React.Component<GameProps, GameState> {

  async componentDidMount() {
    await this.load(this.props.gameID)
  }

  async load(gameID: Long): Promise<void> {
    try { 
      const game = (await this.props.provider.query.Game({ id: gameID })).game
      if (!game) {
        console.error("game not found")
        return
      }
      const params = (await this.props.provider.query.Params({ version: game.paramVersion})).params
      if (!params) {
        console.error("params not found")
        return
      }
      this.setState({ 
        game: game,
        params: params,
      })
    } catch (err) {
      this.setState({ error: err as Error })
    }
  }

  render() {
    if (!this.state.game || !this.state.game.map) {
      return (
        <LoadingCard 
          message="Loading Game..."
        />
      )
    }

    return (
      <MapComponent map={this.state.game.map}/>
    );
  }
}

export default GameComponent;
