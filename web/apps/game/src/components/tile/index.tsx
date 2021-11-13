import styles from './tile.module.less';
import { Landscape, landscapeToJSON } from "../../codec/rook/game/game"

/* eslint-disable-next-line */
export interface TileProps {
  landscape: Landscape;
  x: number
  y: number
}

export function Tile(props: TileProps) {
  return (
    <div className={styles.tile} style={{ marginLeft:props.x, marginTop:props.y}}>
      {landscapeToJSON(props.landscape)}
    </div>
  );
}

export default Tile;
