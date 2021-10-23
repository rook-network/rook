import './game.module.less';
import React from 'react'
import Map from '../map';
import { Map as MapState, Params, State as GameProps } from "../../codec/rook/game/game"

export interface GameState {
  map: MapState,
  params: Params,
}

class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps, state: GameState) {
    super(props)
    this.state = state
  }

  render() {
    return (
      <Map tiles={['red', 'green', 'blue']}/>
    );
  }
}

export default Game;
