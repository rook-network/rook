import styles from './tile.module.less';
import { Landscape, Populace, Settlement } from "../../codec/rook/game/game"
import Mountains1 from '../../assets/terrain/Mountains-1.png';
import Mountains2 from '../../assets/terrain/Mountains-2.png';
import Mountains3 from '../../assets/terrain/Mountains-3.png';
import Mountains4 from '../../assets/terrain/Mountains-4.png';
import Forest1 from '../../assets/terrain/Forest-1.png';
import Forest2 from '../../assets/terrain/Forest-2.png';
import Forest3 from '../../assets/terrain/Forest-3.png';
import Forest4 from '../../assets/terrain/Forest-4.png';
import Lake1 from '../../assets/terrain/Lake-1.png';
import Lake2 from '../../assets/terrain/Lake-2.png';
import Lake3 from '../../assets/terrain/Lake-3.png';
import Lake4 from '../../assets/terrain/Lake-4.png';
import Plains1 from '../../assets/terrain/Plains-1.png';
import Plains2 from '../../assets/terrain/Plains-2.png';

import Capital from '../../assets/settlements/Capital.png';
import Castle from '../../assets/settlements/Castle.png';
import City from '../../assets/settlements/City.png';
import Dock from '../../assets/settlements/Dock.png';
import Farm from '../../assets/settlements/Farm.png';
import Foundry from '../../assets/settlements/Foundry.png';
import Lumbermill from '../../assets/settlements/Lumbermill.png';
import Market from '../../assets/settlements/Market.png';
import Quarry from '../../assets/settlements/Quarry.png';
import Temple from '../../assets/settlements/Temple.png';
import Tower from '../../assets/settlements/Tower.png';
import Town from '../../assets/settlements/Town.png';

const mountains = [Mountains1, Mountains2, Mountains3, Mountains4]
const forests = [Forest1, Forest2, Forest3, Forest4]
const lakes = [Lake1, Lake2, Lake3, Lake4]
const plains = [Plains1, Plains1, Plains1, Plains1, Plains2]

export interface TileProps {
  landscape: Landscape;
  territory: Territory | null;
  size: number
  x: number;
  y: number;
}

export type Territory = {
  populace: Populace
  controllable: boolean
  colour: string
}

export function Tile(props: TileProps) {
  let tile = plains[0]
  let colour = "transparent"
  let amount = undefined
  if (props.territory) {
    colour = props.territory.colour
    amount = props.territory.populace.amount
  }
  if (props.territory && props.territory.populace.settlement !== Settlement.NONE) { 
    switch(props.territory.populace.settlement) {
      case Settlement.CAPITAL:
        tile = Capital
        break;

      case Settlement.CITY:
        tile = City
        break

      case Settlement.FARM:
        tile = Farm
        break

      case Settlement.LUMBERMILL:
        tile = Lumbermill
        break

      case Settlement.QUARRY:
        tile = Quarry
        break
        
      case Settlement.ROOK:
        tile = Tower
        break

      case Settlement.TOWN:
        tile = Town
        break

      default:
        console.error("unknown settlement")
    }
  } else {
    switch (props.landscape) {
      case Landscape.MOUNTAINS:
        tile = mountains[randN(mountains.length)]
        break
  
      case Landscape.LAKE:
        tile = lakes[randN(lakes.length)]
        break;
  
      case Landscape.FOREST:
        tile = forests[randN(forests.length)]
        break;
  
      case Landscape.PLAINS: // Landscape.PLAINS:
        tile = plains[randN(plains.length)]
        break;

      default:
        console.error("unknown landscape " + props.landscape)
        break
    }
  }

  return (
    <div className={styles.tile} style={{ 
      marginLeft:props.x, marginTop:props.y, 
      backgroundColor:colour,
      width: props.size, height: props.size}}>
      { amount &&
        <div className={styles.amount}>
          {amount}
        </div>
      }
      <img src={tile} />
    </div>
  );
}

export default Tile;

function randN(n: number) {
  return Math.floor(Math.random()*n)
}