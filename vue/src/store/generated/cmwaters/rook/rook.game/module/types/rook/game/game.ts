/* eslint-disable */
import * as Long from 'long'
import { util, configure, Writer, Reader } from 'protobufjs/minimal'

export const protobufPackage = 'rook.game'

export enum Direction {
  LEFT = 0,
  RIGHT = 1,
  UP = 2,
  DOWN = 3,
  UNRECOGNIZED = -1
}

export function directionFromJSON(object: any): Direction {
  switch (object) {
    case 0:
    case 'LEFT':
      return Direction.LEFT
    case 1:
    case 'RIGHT':
      return Direction.RIGHT
    case 2:
    case 'UP':
      return Direction.UP
    case 3:
    case 'DOWN':
      return Direction.DOWN
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Direction.UNRECOGNIZED
  }
}

export function directionToJSON(object: Direction): string {
  switch (object) {
    case Direction.LEFT:
      return 'LEFT'
    case Direction.RIGHT:
      return 'RIGHT'
    case Direction.UP:
      return 'UP'
    case Direction.DOWN:
      return 'DOWN'
    default:
      return 'UNKNOWN'
  }
}

export enum Landscape {
  UNKNOWN = 0,
  PLAINS = 1,
  FOREST = 2,
  MOUNTAINS = 3,
  LAKE = 4,
  UNRECOGNIZED = -1
}

export function landscapeFromJSON(object: any): Landscape {
  switch (object) {
    case 0:
    case 'UNKNOWN':
      return Landscape.UNKNOWN
    case 1:
    case 'PLAINS':
      return Landscape.PLAINS
    case 2:
    case 'FOREST':
      return Landscape.FOREST
    case 3:
    case 'MOUNTAINS':
      return Landscape.MOUNTAINS
    case 4:
    case 'LAKE':
      return Landscape.LAKE
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Landscape.UNRECOGNIZED
  }
}

export function landscapeToJSON(object: Landscape): string {
  switch (object) {
    case Landscape.UNKNOWN:
      return 'UNKNOWN'
    case Landscape.PLAINS:
      return 'PLAINS'
    case Landscape.FOREST:
      return 'FOREST'
    case Landscape.MOUNTAINS:
      return 'MOUNTAINS'
    case Landscape.LAKE:
      return 'LAKE'
    default:
      return 'UNKNOWN'
  }
}

export enum Settlement {
  NONE = 0,
  TOWN = 1,
  CITY = 2,
  CAPITAL = 3,
  LUMBERMILL = 4,
  QUARRY = 5,
  FARM = 6,
  ROOK = 7,
  UNRECOGNIZED = -1
}

export function settlementFromJSON(object: any): Settlement {
  switch (object) {
    case 0:
    case 'NONE':
      return Settlement.NONE
    case 1:
    case 'TOWN':
      return Settlement.TOWN
    case 2:
    case 'CITY':
      return Settlement.CITY
    case 3:
    case 'CAPITAL':
      return Settlement.CAPITAL
    case 4:
    case 'LUMBERMILL':
      return Settlement.LUMBERMILL
    case 5:
    case 'QUARRY':
      return Settlement.QUARRY
    case 6:
    case 'FARM':
      return Settlement.FARM
    case 7:
    case 'ROOK':
      return Settlement.ROOK
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Settlement.UNRECOGNIZED
  }
}

export function settlementToJSON(object: Settlement): string {
  switch (object) {
    case Settlement.NONE:
      return 'NONE'
    case Settlement.TOWN:
      return 'TOWN'
    case Settlement.CITY:
      return 'CITY'
    case Settlement.CAPITAL:
      return 'CAPITAL'
    case Settlement.LUMBERMILL:
      return 'LUMBERMILL'
    case Settlement.QUARRY:
      return 'QUARRY'
    case Settlement.FARM:
      return 'FARM'
    case Settlement.ROOK:
      return 'ROOK'
    default:
      return 'UNKNOWN'
  }
}

export interface Overview {
  map: Map | undefined
  paramVersion: number
}

export interface State {
  players: Faction[]
  gaia: Populace[]
  step: number
}

export interface Map {
  tiles: Landscape[]
  width: number
}

export interface Faction {
  player: string
  resources: ResourceSet | undefined
  population: Populace[]
}

export interface Populace {
  amount: number
  position: Position | undefined
  settlement: Settlement
}

export interface Config {
  initial: InitializationConfig | undefined
  map: MapConfig | undefined
}

export interface MapConfig {
  width: number
  height: number
  seed: number
  mountainsDensity: number
  forestDensity: number
  lakeDensity: number
  plainsDensity: number
}

export interface InitializationConfig {
  teams: number
  resources: ResourceSet | undefined
}

export interface Params {
  productionRate: ResourceSet[]
  constructionCost: ResourceSet[]
}

export interface Position {
  x: number
  y: number
}

export interface ResourceSet {
  food: number
  stone: number
  wood: number
  population: number
}

const baseOverview: object = { paramVersion: 0 }

export const Overview = {
  encode(message: Overview, writer: Writer = Writer.create()): Writer {
    if (message.map !== undefined) {
      Map.encode(message.map, writer.uint32(10).fork()).ldelim()
    }
    if (message.paramVersion !== 0) {
      writer.uint32(16).uint32(message.paramVersion)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Overview {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseOverview } as Overview
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.map = Map.decode(reader, reader.uint32())
          break
        case 2:
          message.paramVersion = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Overview {
    const message = { ...baseOverview } as Overview
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromJSON(object.map)
    } else {
      message.map = undefined
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = Number(object.paramVersion)
    } else {
      message.paramVersion = 0
    }
    return message
  },

  toJSON(message: Overview): unknown {
    const obj: any = {}
    message.map !== undefined && (obj.map = message.map ? Map.toJSON(message.map) : undefined)
    message.paramVersion !== undefined && (obj.paramVersion = message.paramVersion)
    return obj
  },

  fromPartial(object: DeepPartial<Overview>): Overview {
    const message = { ...baseOverview } as Overview
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromPartial(object.map)
    } else {
      message.map = undefined
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = object.paramVersion
    } else {
      message.paramVersion = 0
    }
    return message
  }
}

const baseState: object = { step: 0 }

export const State = {
  encode(message: State, writer: Writer = Writer.create()): Writer {
    for (const v of message.players) {
      Faction.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    for (const v of message.gaia) {
      Populace.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    if (message.step !== 0) {
      writer.uint32(24).uint64(message.step)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): State {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseState } as State
    message.players = []
    message.gaia = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.players.push(Faction.decode(reader, reader.uint32()))
          break
        case 2:
          message.gaia.push(Populace.decode(reader, reader.uint32()))
          break
        case 3:
          message.step = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): State {
    const message = { ...baseState } as State
    message.players = []
    message.gaia = []
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(Faction.fromJSON(e))
      }
    }
    if (object.gaia !== undefined && object.gaia !== null) {
      for (const e of object.gaia) {
        message.gaia.push(Populace.fromJSON(e))
      }
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = Number(object.step)
    } else {
      message.step = 0
    }
    return message
  },

  toJSON(message: State): unknown {
    const obj: any = {}
    if (message.players) {
      obj.players = message.players.map((e) => (e ? Faction.toJSON(e) : undefined))
    } else {
      obj.players = []
    }
    if (message.gaia) {
      obj.gaia = message.gaia.map((e) => (e ? Populace.toJSON(e) : undefined))
    } else {
      obj.gaia = []
    }
    message.step !== undefined && (obj.step = message.step)
    return obj
  },

  fromPartial(object: DeepPartial<State>): State {
    const message = { ...baseState } as State
    message.players = []
    message.gaia = []
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(Faction.fromPartial(e))
      }
    }
    if (object.gaia !== undefined && object.gaia !== null) {
      for (const e of object.gaia) {
        message.gaia.push(Populace.fromPartial(e))
      }
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = object.step
    } else {
      message.step = 0
    }
    return message
  }
}

const baseMap: object = { tiles: 0, width: 0 }

export const Map = {
  encode(message: Map, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).fork()
    for (const v of message.tiles) {
      writer.int32(v)
    }
    writer.ldelim()
    if (message.width !== 0) {
      writer.uint32(16).uint32(message.width)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Map {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMap } as Map
    message.tiles = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos
            while (reader.pos < end2) {
              message.tiles.push(reader.int32() as any)
            }
          } else {
            message.tiles.push(reader.int32() as any)
          }
          break
        case 2:
          message.width = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Map {
    const message = { ...baseMap } as Map
    message.tiles = []
    if (object.tiles !== undefined && object.tiles !== null) {
      for (const e of object.tiles) {
        message.tiles.push(landscapeFromJSON(e))
      }
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = Number(object.width)
    } else {
      message.width = 0
    }
    return message
  },

  toJSON(message: Map): unknown {
    const obj: any = {}
    if (message.tiles) {
      obj.tiles = message.tiles.map((e) => landscapeToJSON(e))
    } else {
      obj.tiles = []
    }
    message.width !== undefined && (obj.width = message.width)
    return obj
  },

  fromPartial(object: DeepPartial<Map>): Map {
    const message = { ...baseMap } as Map
    message.tiles = []
    if (object.tiles !== undefined && object.tiles !== null) {
      for (const e of object.tiles) {
        message.tiles.push(e)
      }
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = object.width
    } else {
      message.width = 0
    }
    return message
  }
}

const baseFaction: object = { player: '' }

export const Faction = {
  encode(message: Faction, writer: Writer = Writer.create()): Writer {
    if (message.player !== '') {
      writer.uint32(10).string(message.player)
    }
    if (message.resources !== undefined) {
      ResourceSet.encode(message.resources, writer.uint32(18).fork()).ldelim()
    }
    for (const v of message.population) {
      Populace.encode(v!, writer.uint32(26).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Faction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseFaction } as Faction
    message.population = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string()
          break
        case 2:
          message.resources = ResourceSet.decode(reader, reader.uint32())
          break
        case 3:
          message.population.push(Populace.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Faction {
    const message = { ...baseFaction } as Faction
    message.population = []
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player)
    } else {
      message.player = ''
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromJSON(object.resources)
    } else {
      message.resources = undefined
    }
    if (object.population !== undefined && object.population !== null) {
      for (const e of object.population) {
        message.population.push(Populace.fromJSON(e))
      }
    }
    return message
  },

  toJSON(message: Faction): unknown {
    const obj: any = {}
    message.player !== undefined && (obj.player = message.player)
    message.resources !== undefined && (obj.resources = message.resources ? ResourceSet.toJSON(message.resources) : undefined)
    if (message.population) {
      obj.population = message.population.map((e) => (e ? Populace.toJSON(e) : undefined))
    } else {
      obj.population = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<Faction>): Faction {
    const message = { ...baseFaction } as Faction
    message.population = []
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player
    } else {
      message.player = ''
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromPartial(object.resources)
    } else {
      message.resources = undefined
    }
    if (object.population !== undefined && object.population !== null) {
      for (const e of object.population) {
        message.population.push(Populace.fromPartial(e))
      }
    }
    return message
  }
}

const basePopulace: object = { amount: 0, settlement: 0 }

export const Populace = {
  encode(message: Populace, writer: Writer = Writer.create()): Writer {
    if (message.amount !== 0) {
      writer.uint32(8).uint32(message.amount)
    }
    if (message.position !== undefined) {
      Position.encode(message.position, writer.uint32(18).fork()).ldelim()
    }
    if (message.settlement !== 0) {
      writer.uint32(24).int32(message.settlement)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Populace {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...basePopulace } as Populace
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.uint32()
          break
        case 2:
          message.position = Position.decode(reader, reader.uint32())
          break
        case 3:
          message.settlement = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Populace {
    const message = { ...basePopulace } as Populace
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount)
    } else {
      message.amount = 0
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Position.fromJSON(object.position)
    } else {
      message.position = undefined
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = settlementFromJSON(object.settlement)
    } else {
      message.settlement = 0
    }
    return message
  },

  toJSON(message: Populace): unknown {
    const obj: any = {}
    message.amount !== undefined && (obj.amount = message.amount)
    message.position !== undefined && (obj.position = message.position ? Position.toJSON(message.position) : undefined)
    message.settlement !== undefined && (obj.settlement = settlementToJSON(message.settlement))
    return obj
  },

  fromPartial(object: DeepPartial<Populace>): Populace {
    const message = { ...basePopulace } as Populace
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount
    } else {
      message.amount = 0
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Position.fromPartial(object.position)
    } else {
      message.position = undefined
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = object.settlement
    } else {
      message.settlement = 0
    }
    return message
  }
}

const baseConfig: object = {}

export const Config = {
  encode(message: Config, writer: Writer = Writer.create()): Writer {
    if (message.initial !== undefined) {
      InitializationConfig.encode(message.initial, writer.uint32(10).fork()).ldelim()
    }
    if (message.map !== undefined) {
      MapConfig.encode(message.map, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Config {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseConfig } as Config
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.initial = InitializationConfig.decode(reader, reader.uint32())
          break
        case 2:
          message.map = MapConfig.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Config {
    const message = { ...baseConfig } as Config
    if (object.initial !== undefined && object.initial !== null) {
      message.initial = InitializationConfig.fromJSON(object.initial)
    } else {
      message.initial = undefined
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = MapConfig.fromJSON(object.map)
    } else {
      message.map = undefined
    }
    return message
  },

  toJSON(message: Config): unknown {
    const obj: any = {}
    message.initial !== undefined && (obj.initial = message.initial ? InitializationConfig.toJSON(message.initial) : undefined)
    message.map !== undefined && (obj.map = message.map ? MapConfig.toJSON(message.map) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Config>): Config {
    const message = { ...baseConfig } as Config
    if (object.initial !== undefined && object.initial !== null) {
      message.initial = InitializationConfig.fromPartial(object.initial)
    } else {
      message.initial = undefined
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = MapConfig.fromPartial(object.map)
    } else {
      message.map = undefined
    }
    return message
  }
}

const baseMapConfig: object = { width: 0, height: 0, seed: 0, mountainsDensity: 0, forestDensity: 0, lakeDensity: 0, plainsDensity: 0 }

export const MapConfig = {
  encode(message: MapConfig, writer: Writer = Writer.create()): Writer {
    if (message.width !== 0) {
      writer.uint32(8).uint32(message.width)
    }
    if (message.height !== 0) {
      writer.uint32(16).uint32(message.height)
    }
    if (message.seed !== 0) {
      writer.uint32(24).int64(message.seed)
    }
    if (message.mountainsDensity !== 0) {
      writer.uint32(32).uint32(message.mountainsDensity)
    }
    if (message.forestDensity !== 0) {
      writer.uint32(40).uint32(message.forestDensity)
    }
    if (message.lakeDensity !== 0) {
      writer.uint32(48).uint32(message.lakeDensity)
    }
    if (message.plainsDensity !== 0) {
      writer.uint32(56).uint32(message.plainsDensity)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): MapConfig {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMapConfig } as MapConfig
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.width = reader.uint32()
          break
        case 2:
          message.height = reader.uint32()
          break
        case 3:
          message.seed = longToNumber(reader.int64() as Long)
          break
        case 4:
          message.mountainsDensity = reader.uint32()
          break
        case 5:
          message.forestDensity = reader.uint32()
          break
        case 6:
          message.lakeDensity = reader.uint32()
          break
        case 7:
          message.plainsDensity = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MapConfig {
    const message = { ...baseMapConfig } as MapConfig
    if (object.width !== undefined && object.width !== null) {
      message.width = Number(object.width)
    } else {
      message.width = 0
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Number(object.height)
    } else {
      message.height = 0
    }
    if (object.seed !== undefined && object.seed !== null) {
      message.seed = Number(object.seed)
    } else {
      message.seed = 0
    }
    if (object.mountainsDensity !== undefined && object.mountainsDensity !== null) {
      message.mountainsDensity = Number(object.mountainsDensity)
    } else {
      message.mountainsDensity = 0
    }
    if (object.forestDensity !== undefined && object.forestDensity !== null) {
      message.forestDensity = Number(object.forestDensity)
    } else {
      message.forestDensity = 0
    }
    if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
      message.lakeDensity = Number(object.lakeDensity)
    } else {
      message.lakeDensity = 0
    }
    if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
      message.plainsDensity = Number(object.plainsDensity)
    } else {
      message.plainsDensity = 0
    }
    return message
  },

  toJSON(message: MapConfig): unknown {
    const obj: any = {}
    message.width !== undefined && (obj.width = message.width)
    message.height !== undefined && (obj.height = message.height)
    message.seed !== undefined && (obj.seed = message.seed)
    message.mountainsDensity !== undefined && (obj.mountainsDensity = message.mountainsDensity)
    message.forestDensity !== undefined && (obj.forestDensity = message.forestDensity)
    message.lakeDensity !== undefined && (obj.lakeDensity = message.lakeDensity)
    message.plainsDensity !== undefined && (obj.plainsDensity = message.plainsDensity)
    return obj
  },

  fromPartial(object: DeepPartial<MapConfig>): MapConfig {
    const message = { ...baseMapConfig } as MapConfig
    if (object.width !== undefined && object.width !== null) {
      message.width = object.width
    } else {
      message.width = 0
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height
    } else {
      message.height = 0
    }
    if (object.seed !== undefined && object.seed !== null) {
      message.seed = object.seed
    } else {
      message.seed = 0
    }
    if (object.mountainsDensity !== undefined && object.mountainsDensity !== null) {
      message.mountainsDensity = object.mountainsDensity
    } else {
      message.mountainsDensity = 0
    }
    if (object.forestDensity !== undefined && object.forestDensity !== null) {
      message.forestDensity = object.forestDensity
    } else {
      message.forestDensity = 0
    }
    if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
      message.lakeDensity = object.lakeDensity
    } else {
      message.lakeDensity = 0
    }
    if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
      message.plainsDensity = object.plainsDensity
    } else {
      message.plainsDensity = 0
    }
    return message
  }
}

const baseInitializationConfig: object = { teams: 0 }

export const InitializationConfig = {
  encode(message: InitializationConfig, writer: Writer = Writer.create()): Writer {
    if (message.teams !== 0) {
      writer.uint32(8).uint32(message.teams)
    }
    if (message.resources !== undefined) {
      ResourceSet.encode(message.resources, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): InitializationConfig {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseInitializationConfig } as InitializationConfig
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.teams = reader.uint32()
          break
        case 2:
          message.resources = ResourceSet.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): InitializationConfig {
    const message = { ...baseInitializationConfig } as InitializationConfig
    if (object.teams !== undefined && object.teams !== null) {
      message.teams = Number(object.teams)
    } else {
      message.teams = 0
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromJSON(object.resources)
    } else {
      message.resources = undefined
    }
    return message
  },

  toJSON(message: InitializationConfig): unknown {
    const obj: any = {}
    message.teams !== undefined && (obj.teams = message.teams)
    message.resources !== undefined && (obj.resources = message.resources ? ResourceSet.toJSON(message.resources) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<InitializationConfig>): InitializationConfig {
    const message = { ...baseInitializationConfig } as InitializationConfig
    if (object.teams !== undefined && object.teams !== null) {
      message.teams = object.teams
    } else {
      message.teams = 0
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromPartial(object.resources)
    } else {
      message.resources = undefined
    }
    return message
  }
}

const baseParams: object = {}

export const Params = {
  encode(message: Params, writer: Writer = Writer.create()): Writer {
    for (const v of message.productionRate) {
      ResourceSet.encode(v!, writer.uint32(10).fork()).ldelim()
    }
    for (const v of message.constructionCost) {
      ResourceSet.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseParams } as Params
    message.productionRate = []
    message.constructionCost = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.productionRate.push(ResourceSet.decode(reader, reader.uint32()))
          break
        case 2:
          message.constructionCost.push(ResourceSet.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Params {
    const message = { ...baseParams } as Params
    message.productionRate = []
    message.constructionCost = []
    if (object.productionRate !== undefined && object.productionRate !== null) {
      for (const e of object.productionRate) {
        message.productionRate.push(ResourceSet.fromJSON(e))
      }
    }
    if (object.constructionCost !== undefined && object.constructionCost !== null) {
      for (const e of object.constructionCost) {
        message.constructionCost.push(ResourceSet.fromJSON(e))
      }
    }
    return message
  },

  toJSON(message: Params): unknown {
    const obj: any = {}
    if (message.productionRate) {
      obj.productionRate = message.productionRate.map((e) => (e ? ResourceSet.toJSON(e) : undefined))
    } else {
      obj.productionRate = []
    }
    if (message.constructionCost) {
      obj.constructionCost = message.constructionCost.map((e) => (e ? ResourceSet.toJSON(e) : undefined))
    } else {
      obj.constructionCost = []
    }
    return obj
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params
    message.productionRate = []
    message.constructionCost = []
    if (object.productionRate !== undefined && object.productionRate !== null) {
      for (const e of object.productionRate) {
        message.productionRate.push(ResourceSet.fromPartial(e))
      }
    }
    if (object.constructionCost !== undefined && object.constructionCost !== null) {
      for (const e of object.constructionCost) {
        message.constructionCost.push(ResourceSet.fromPartial(e))
      }
    }
    return message
  }
}

const basePosition: object = { x: 0, y: 0 }

export const Position = {
  encode(message: Position, writer: Writer = Writer.create()): Writer {
    if (message.x !== 0) {
      writer.uint32(24).uint32(message.x)
    }
    if (message.y !== 0) {
      writer.uint32(32).uint32(message.y)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Position {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...basePosition } as Position
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 3:
          message.x = reader.uint32()
          break
        case 4:
          message.y = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Position {
    const message = { ...basePosition } as Position
    if (object.x !== undefined && object.x !== null) {
      message.x = Number(object.x)
    } else {
      message.x = 0
    }
    if (object.y !== undefined && object.y !== null) {
      message.y = Number(object.y)
    } else {
      message.y = 0
    }
    return message
  },

  toJSON(message: Position): unknown {
    const obj: any = {}
    message.x !== undefined && (obj.x = message.x)
    message.y !== undefined && (obj.y = message.y)
    return obj
  },

  fromPartial(object: DeepPartial<Position>): Position {
    const message = { ...basePosition } as Position
    if (object.x !== undefined && object.x !== null) {
      message.x = object.x
    } else {
      message.x = 0
    }
    if (object.y !== undefined && object.y !== null) {
      message.y = object.y
    } else {
      message.y = 0
    }
    return message
  }
}

const baseResourceSet: object = { food: 0, stone: 0, wood: 0, population: 0 }

export const ResourceSet = {
  encode(message: ResourceSet, writer: Writer = Writer.create()): Writer {
    if (message.food !== 0) {
      writer.uint32(8).uint32(message.food)
    }
    if (message.stone !== 0) {
      writer.uint32(16).uint32(message.stone)
    }
    if (message.wood !== 0) {
      writer.uint32(24).uint32(message.wood)
    }
    if (message.population !== 0) {
      writer.uint32(32).uint32(message.population)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): ResourceSet {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseResourceSet } as ResourceSet
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.food = reader.uint32()
          break
        case 2:
          message.stone = reader.uint32()
          break
        case 3:
          message.wood = reader.uint32()
          break
        case 4:
          message.population = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): ResourceSet {
    const message = { ...baseResourceSet } as ResourceSet
    if (object.food !== undefined && object.food !== null) {
      message.food = Number(object.food)
    } else {
      message.food = 0
    }
    if (object.stone !== undefined && object.stone !== null) {
      message.stone = Number(object.stone)
    } else {
      message.stone = 0
    }
    if (object.wood !== undefined && object.wood !== null) {
      message.wood = Number(object.wood)
    } else {
      message.wood = 0
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = Number(object.population)
    } else {
      message.population = 0
    }
    return message
  },

  toJSON(message: ResourceSet): unknown {
    const obj: any = {}
    message.food !== undefined && (obj.food = message.food)
    message.stone !== undefined && (obj.stone = message.stone)
    message.wood !== undefined && (obj.wood = message.wood)
    message.population !== undefined && (obj.population = message.population)
    return obj
  },

  fromPartial(object: DeepPartial<ResourceSet>): ResourceSet {
    const message = { ...baseResourceSet } as ResourceSet
    if (object.food !== undefined && object.food !== null) {
      message.food = object.food
    } else {
      message.food = 0
    }
    if (object.stone !== undefined && object.stone !== null) {
      message.stone = object.stone
    } else {
      message.stone = 0
    }
    if (object.wood !== undefined && object.wood !== null) {
      message.wood = object.wood
    } else {
      message.wood = 0
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = object.population
    } else {
      message.population = 0
    }
    return message
  }
}

declare var self: any | undefined
declare var window: any | undefined
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  if (typeof global !== 'undefined') return global
  throw 'Unable to locate global object'
})()

type Builtin = Date | Function | Uint8Array | string | number | undefined
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

if (util.Long !== Long) {
  util.Long = Long as any
  configure()
}
