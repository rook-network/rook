import styles from './map.module.less';
import Tile from '../tile'
import { Map, Landscape } from "../../codec/rook/game/game"

/* eslint-disable-next-line */
export interface MapProps {
  map: Map
}

export function MapComponent(props: MapProps) {
  return (
    <div className={styles.map}>
      <div id="map-ref" className={styles.ref}>
        {props.map.tiles.map((landscape: Landscape, index: number) => (
            <Tile landscape={landscape} y={0} x={index*64}/>
        ))}
      </div>
    </div>
  );
}

export default MapComponent;
