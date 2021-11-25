import './game.module.less';
import React from 'react'
import MapComponent from '../map';
import { Territory } from '../tile';
import { GameProvider } from "../provider";
import { GameSnapshot, Position, Faction, Settlement, State, Direction } from "../../codec/rook/game/game";
import { Params } from "../../codec/rook/game/config";
import { LoadingCard } from '../card/index';
import { ResourcesDisplay } from '../gui'
import Long from 'long';

const allyColour = "#0E9594"
const enemyColour = "#ef9e9e"

export interface GameProps {
  gameID: Long
  provider: GameProvider
  address: string
}

export interface GameState {
  game?: GameSnapshot
  params?: Params
  territory?: (Territory | null)[]
  error?: Error
  faction?: Faction
  cursor: Position
}

class GameComponent extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props)
    this.state = {
      game: undefined,
      params: undefined,
      error: undefined,
      faction: undefined,
      cursor: {x: 0, y: 0}
    }
    this.load = this.load.bind(this)
    this.calculateTerritory = this.calculateTerritory.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.setCursor = this.setCursor.bind(this)
    document.addEventListener('keydown', this.handleKeyDown)
  }

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
      console.log(game.state)
      this.calculateTerritory()
      this.updateUsersFaction()
      this.setState({ cursor: initCursor(this.state.faction)})
      await this.setupSocket(gameID)
    } catch (err) {
      this.setState({ error: err as Error })
    }
  }

  async setupSocket(gameID: Long): Promise<void> {
    await this.props.provider.subscribeToGame(gameID, (state: State) => {
      console.log("received a new game update")
      console.log(state)
      const game = this.state.game
      if (!game) return
      game.state = state
      this.setState({ game: game})
      this.calculateTerritory()
      this.updateUsersFaction()
    })
  }

  handleKeyDown(event: Event): void {
    switch((event as KeyboardEvent).key) {
      case "ArrowUp":
        this.state.cursor.y--
        this.setState({ cursor: this.state.cursor })
        break;
      case "ArrowDown":
        this.state.cursor.y++
        this.setState({ cursor: this.state.cursor })
        break;
      case "ArrowLeft":
        this.state.cursor.x--
        this.setState({ cursor: this.state.cursor })
        break;
      case "ArrowRight":
        this.state.cursor.x++
        this.setState({ cursor: this.state.cursor })
        break
      case "w":
        this.move(Direction.UP)
        break;
      case "a":
        this.move(Direction.LEFT)
        break;
      case "s":
        this.move(Direction.DOWN)
        break
      case "d":
        this.move(Direction.RIGHT)
        break
      case "q":
        this.build(Settlement.QUARRY)
        break;
      case "f":
        this.build(Settlement.FARM)
        break;
      case "t":
        this.build(Settlement.TOWN)
        break;
      case "r":
        this.build(Settlement.ROOK)
        break;
      case "c":
        this.build(Settlement.CITY)
        break;
      case "l":
        this.build(Settlement.LUMBERMILL)
    }
    return
  }

  updateUsersFaction() {
    if (!this.state.game) return
    for (const faction of this.state.game.state!.factions) {
      if (isOurFaction(faction, this.props.address)) {
        this.setState({
          faction: faction
        })
      }
    }
  }

  setCursor(index: number): void {
    if (!this.state.game || !this.state.game.map) return
    const pos = indexToPosition(index, this.state.game.map.width)
    console.log("setting cursor to " + pos.x + " and " + pos.y)
    this.setState({ cursor: pos })
  }

  calculateTerritory() {
    if (!this.state.game || !this.state.game.map)
      return

    const territory: (Territory | null)[] = new Array(this.state.game.map.tiles.length).fill(null)
    for (const faction of this.state.game.state!.factions) {
      const isUser = isOurFaction(faction, this.props.address)
      for (const populace of faction.population) {
        const pos = positionToIndex(populace.position!, this.state.game.map.width)
        console.log(pos)
        territory[pos] = {
          populace: populace,
          colour: isUser ? allyColour : enemyColour,
          controllable: true,
        }
      }
    }
    console.log(territory)
    this.setState({ territory: territory })
  }

  async build(settlement: Settlement): Promise<void> {
    return
  }

  async move(direction: Direction, population?: number): Promise<void> {
    if (!this.state.faction) return
    const index = this.findPopulaceIndex(this.state.cursor)
    if (index === null) return
    let totalPopulation = this.state.faction.population[index].amount
    // when moving away from a settlement at least one population must be left behind
    if (this.state.faction.population[index].settlement !== Settlement.NONE)
      totalPopulation--
    population = population === undefined || population > totalPopulation ? totalPopulation:population;
    console.log("sending move request")
    const resp = await this.props.provider.tx.Move({
      creator: this.props.provider.mainAddress,
      gameId: this.props.gameID,
      populace: index,
      direction: direction,
      population: population
    })
    console.log(resp);
  }

  findPopulaceIndex(position: Position): number | null {
    if (!this.state.game || !this.state.game.map || !this.state.faction) return null
    for (let i = 0; i < this.state.faction.population.length; i++) {
      const populace = this.state.faction.population[i]
      if (!populace.position) throw new Error("no position for population")
      if (populace.position.x === position.x && populace.position.y === position.y) {
        return i
      }
    }
    return null
  }

  render() {
    if (this.state.game === undefined 
      || this.state.game.map === undefined
      || this.state.territory === undefined
      || this.state.faction === undefined) {
      return (
        <LoadingCard 
          message="Loading Game..."
        />
      )
    }

    return (
      <>
        <ResourcesDisplay resources={this.state.faction.resources!}/>
        <MapComponent map={this.state.game.map} territory={this.state.territory} cursor={this.state.cursor} setCursor={this.setCursor}/>
      </>
    );
  }
}

function positionToIndex(pos: Position, width: number): number {
  return pos.y * width + pos.x
}

function indexToPosition(index: number, width: number): Position {
  return { x: index % width, y: Math.floor(index / width) }
}

function isOurFaction(faction: Faction, player: string): boolean {
  for (const p of faction.players) {
    if (p === player) {
      return true
    }
  }
  return false
}

function initCursor(faction?: Faction): Position {
  if (!faction) { return {x: 0, y: 0 }}
  for (const p of faction.population) {
    if (p.settlement === Settlement.CAPITAL) {
      return p.position!
    }
  }
  return { x:0, y:0 }
}

export default GameComponent;
