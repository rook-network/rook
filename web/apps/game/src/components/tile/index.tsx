import styles from './tile.module.less';

/* eslint-disable-next-line */
export interface TileProps {
  color: string
  x: number
  y: number
}

export function Tile(props: TileProps) {
  return (
    <div className={styles.tile} style={{ marginLeft:props.x, marginTop:props.y, backgroundColor:props.color}}>
    </div>
  );
}

export default Tile;
