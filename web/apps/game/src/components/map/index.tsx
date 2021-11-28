import styles from './map.module.less';
import Tile, { Territory } from '../tile'
import { Map, Landscape, Position } from "../../codec/rook/game/game"

/* eslint-disable-next-line */
export interface MapProps {
  cursor: Position
  map: Map
  territory: (Territory | null)[]
  setCursor: (index: number) => void
}

export function MapComponent(props: MapProps) {
  const size = 80
  // const screenWidth = document.body.clientWidth
  // const screenHeight = document.body.clientHeight
  // const rows = Math.ceil(screenHeight / size)
  // const cols = Math.ceil(screenWidth / size)
  const calcX = (index: number): number => {
    return Math.floor(index % props.map.width) * size
  }
  const calcY = (index: number): number => {
    return Math.floor(index / props.map.width) * size
  }

  const height = props.map.tiles.length/props.map.width
  const centerX = Math.floor(props.map.width/2)
  const centerY = Math.floor(height/2)
  const offset = { x: centerX - props.cursor.x, y: centerY - props.cursor.y }

  const grid = serialize(shift(createGrid(height, props.map.width), offset))

  const isSelected = (index: number): boolean => {
    return (Math.floor(index % props.map.width) === centerX 
      && Math.floor(index / props.map.width) === centerY)
  }


  return (
    <div className={styles.map}>
      <div className={styles.ref} style={{width: props.map.width*size, height: height*size }}>
        {grid.map((val: number, index: number) => (
            <Tile 
              index={val}
              landscape={props.map.tiles[val]} 
              y={calcY(index)} x={calcX(index)}
              territory={props.territory[val]}
              size={size}
              selected={isSelected(index)}
              setCursor={props.setCursor}
            />
        ))}
      </div>
    </div>
  );
}

export default MapComponent;

export type grid = number[][]

export function serialize(grid: grid): number[] {
  const output: number[] = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      output.push(grid[i][j])
    }
  }
  return output
}

export function createGrid(height: number, width: number): grid {
  const output: grid = []
  for (let row = 0; row < height; row++) {
    output.push([])
    for (let el = 0; el < width; el++) {
      const val = row * width + el
      output[row].push(val)
    }
  }
  return output
}

// shift columns to the right. The right most column becomes the left most column
export function shiftColumns(grid: grid, delta: number): grid {
  const output: grid = [] 
  for (let row = 0; row < grid.length; row++) {
    output.push([])
    for (let el = 0; el < grid[row].length; el++) {
      const newIdx = (el - delta + grid[row].length) % grid[row].length
      output[row].push(grid[row][newIdx])
    }
  }
  return output
}

// shift rows downwards. The bottom most row becomes the top most row
export function shiftRows(grid: grid, delta: number) {
  const output: grid = []
  for (let row = 0; row < grid.length; row++) {
    const newIdx = (row - delta + grid.length) % grid.length
    output.push(grid[newIdx])
  }
  return output
}

export function shift(grid: grid, delta: Position) {
  return shiftRows(shiftColumns(grid, delta.x), delta.y)
}
