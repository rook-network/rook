import './game.module.less';
import Map from '../map/map';


/* eslint-disable-next-line */
export interface GameProps {}

export function Game(props: GameProps) {
  return (
    <Map tiles={['red', 'green', 'blue']}/>
  );
}

export default Game;
