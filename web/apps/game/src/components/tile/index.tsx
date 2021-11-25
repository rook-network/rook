import styles from './tile.module.less';
import { Landscape, Populace, Position, Settlement } from "../../codec/rook/game/game"
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
const plains = [Plains1, Plains1, Plains1, Plains1]

export interface TileProps {
  index: number
  landscape: Landscape;
  territory: Territory | null;
  size: number
  x: number;
  y: number;
  selected: boolean;
  setCursor: (index: number) => void;
}

export type Territory = {
  populace: Populace
  controllable: boolean
  colour: string
}

export function Tile(props: TileProps) {
  let tile = plains[0]
  let colour = "#ffffff"
  let amount = undefined
  if (props.territory) {
    colour = props.territory.colour
    amount = props.territory.populace.amount
  }
  if (props.selected) {
    // colour = "#fc033d";
    colour = shadeColour(colour, -20)
    console.log("new colour: " + colour)
  }
  if (props.territory && props.territory.populace.settlement !== Settlement.NONE && props.territory.populace.settlement !== undefined) { 
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
        console.error("unknown settlement " + props.territory.populace.settlement)
    }
  } else {
    switch (props.landscape) {
      case Landscape.MOUNTAINS:
        tile = mountains[randN(props.index, mountains.length)]
        break
  
      case Landscape.LAKE:
        tile = lakes[randN(props.index, lakes.length)]
        break;
  
      case Landscape.FOREST:
        tile = forests[randN(props.index, forests.length)]
        break;
  
      case Landscape.PLAINS: // Landscape.PLAINS:
        tile = plains[randN(props.index, plains.length)]
        break;

      default:
        console.error("unknown landscape " + props.landscape)
        break
    }
  }

  const handleClick = (e: any) => {
    props.setCursor(props.index)
  }

  return (
    <div className={styles.tile} onClick={handleClick} style={{ 
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

function randN(seed: number, n: number) {
  return Math.floor((Math.sin(seed++) + 1)/2 * n)
}

function shadeColour(colour: string, percent: number) {
  let R = parseInt(colour.substring(1,3),16);
  let G = parseInt(colour.substring(3,5),16);
  let B = parseInt(colour.substring(5,7),16);

  R = Math.floor(R * (100 + percent) / 100);
  G = Math.floor(G * (100 + percent) / 100);
  B = Math.floor(B * (100 + percent) / 100);

  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  

  const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
  const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
  const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

  return "#"+RR+GG+BB;
}