import styles from './map.module.less';
import Tile from '../tile'

/* eslint-disable-next-line */
export interface MapProps {
  tiles: string[]
}

export function Map(props: MapProps) {
  return (
    <div className={styles.map}>
      {props.tiles.map((color: string, index: number) => (
          <Tile color={color} y={0} x={index*64}/>
      ))}
    </div>
  );
}

export default Map;
