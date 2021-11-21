import './game.module.less';
import React from 'react'
import MapComponent from '../map';
import { Territory } from '../tile';
import { GameProvider } from "../provider";
import { GameSnapshot, Position, Faction, Settlement, State } from "../../codec/rook/game/game";
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
      this.calculateTerritory()
      this.props.provider.subscribeToGame(gameID, (state: State) => {
        console.log("received a new game update")
      })
    } catch (err) {
      this.setState({ error: err as Error })
    }
  }

  calculateTerritory() {
    if (!this.state.game || !this.state.game.map)
      return

    const territory: (Territory | null)[] = new Array(this.state.game.map.tiles.length).fill(null)
    for (const faction of this.state.game.state!.factions) {
      const isEnemy = isEnemyFaction(faction, this.props.address)
      if (!isEnemy) {
        this.setState({
          cursor: initCursor(faction),
          faction: faction
        })
      }
      for (const populace of faction.population) {
        const pos = positionToIndex(populace.position!, this.state.game.map.width)
        console.log(pos)
        territory[pos] = {
          populace: populace,
          colour: isEnemy ? enemyColour : allyColour,
          controllable: true,
        }
      }
    }
    console.log(territory)
    this.setState({ territory: territory })
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
        <MapComponent map={this.state.game.map} territory={this.state.territory} cursor={this.state.cursor}/>
      </>
    );
  }
}

function positionToIndex(pos: Position, width: number): number {
  return pos.y * width + pos.x
}

function isEnemyFaction(faction: Faction, player: string): boolean {
  for (const p of faction.players) {
    if (p === player) {
      return false
    }
  }
  return true
}

function initCursor(faction: Faction): Position {
  for (const p of faction.population) {
    if (p.settlement === Settlement.CAPITAL) {
      return p.position!
    }
  }
  throw new Error("not capital found")
}

export default GameComponent;
