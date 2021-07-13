/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal'

export const protobufPackage = 'cmwaters.rook.rook'

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

export interface Map {
  tiles: Tile[]
  width: number
}

export interface Tile {
  landscape: Landscape
  faction: string
}

export interface Faction {
  resources: ResourceSet | undefined
  population: { [key: number]: number }
  settlements: { [key: number]: Settlement }
}

export interface Faction_PopulationEntry {
  key: number
  value: number
}

export interface Faction_SettlementsEntry {
  key: number
  value: Settlement
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

const baseMap: object = { width: 0 }

export const Map = {
  encode(message: Map, writer: Writer = Writer.create()): Writer {
    for (const v of message.tiles) {
      Tile.encode(v!, writer.uint32(10).fork()).ldelim()
    }
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
          message.tiles.push(Tile.decode(reader, reader.uint32()))
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
        message.tiles.push(Tile.fromJSON(e))
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
      obj.tiles = message.tiles.map((e) => (e ? Tile.toJSON(e) : undefined))
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
        message.tiles.push(Tile.fromPartial(e))
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

const baseTile: object = { landscape: 0, faction: '' }

export const Tile = {
  encode(message: Tile, writer: Writer = Writer.create()): Writer {
    if (message.landscape !== 0) {
      writer.uint32(8).int32(message.landscape)
    }
    if (message.faction !== '') {
      writer.uint32(18).string(message.faction)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Tile {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseTile } as Tile
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.landscape = reader.int32() as any
          break
        case 2:
          message.faction = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Tile {
    const message = { ...baseTile } as Tile
    if (object.landscape !== undefined && object.landscape !== null) {
      message.landscape = landscapeFromJSON(object.landscape)
    } else {
      message.landscape = 0
    }
    if (object.faction !== undefined && object.faction !== null) {
      message.faction = String(object.faction)
    } else {
      message.faction = ''
    }
    return message
  },

  toJSON(message: Tile): unknown {
    const obj: any = {}
    message.landscape !== undefined && (obj.landscape = landscapeToJSON(message.landscape))
    message.faction !== undefined && (obj.faction = message.faction)
    return obj
  },

  fromPartial(object: DeepPartial<Tile>): Tile {
    const message = { ...baseTile } as Tile
    if (object.landscape !== undefined && object.landscape !== null) {
      message.landscape = object.landscape
    } else {
      message.landscape = 0
    }
    if (object.faction !== undefined && object.faction !== null) {
      message.faction = object.faction
    } else {
      message.faction = ''
    }
    return message
  }
}

const baseFaction: object = {}

export const Faction = {
  encode(message: Faction, writer: Writer = Writer.create()): Writer {
    if (message.resources !== undefined) {
      ResourceSet.encode(message.resources, writer.uint32(10).fork()).ldelim()
    }
    Object.entries(message.population).forEach(([key, value]) => {
      Faction_PopulationEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim()
    })
    Object.entries(message.settlements).forEach(([key, value]) => {
      Faction_SettlementsEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim()
    })
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Faction {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseFaction } as Faction
    message.population = {}
    message.settlements = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.resources = ResourceSet.decode(reader, reader.uint32())
          break
        case 2:
          const entry2 = Faction_PopulationEntry.decode(reader, reader.uint32())
          if (entry2.value !== undefined) {
            message.population[entry2.key] = entry2.value
          }
          break
        case 3:
          const entry3 = Faction_SettlementsEntry.decode(reader, reader.uint32())
          if (entry3.value !== undefined) {
            message.settlements[entry3.key] = entry3.value
          }
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
    message.population = {}
    message.settlements = {}
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromJSON(object.resources)
    } else {
      message.resources = undefined
    }
    if (object.population !== undefined && object.population !== null) {
      Object.entries(object.population).forEach(([key, value]) => {
        message.population[Number(key)] = Number(value)
      })
    }
    if (object.settlements !== undefined && object.settlements !== null) {
      Object.entries(object.settlements).forEach(([key, value]) => {
        message.settlements[Number(key)] = value as number
      })
    }
    return message
  },

  toJSON(message: Faction): unknown {
    const obj: any = {}
    message.resources !== undefined && (obj.resources = message.resources ? ResourceSet.toJSON(message.resources) : undefined)
    obj.population = {}
    if (message.population) {
      Object.entries(message.population).forEach(([k, v]) => {
        obj.population[k] = v
      })
    }
    obj.settlements = {}
    if (message.settlements) {
      Object.entries(message.settlements).forEach(([k, v]) => {
        obj.settlements[k] = settlementToJSON(v)
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<Faction>): Faction {
    const message = { ...baseFaction } as Faction
    message.population = {}
    message.settlements = {}
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromPartial(object.resources)
    } else {
      message.resources = undefined
    }
    if (object.population !== undefined && object.population !== null) {
      Object.entries(object.population).forEach(([key, value]) => {
        if (value !== undefined) {
          message.population[Number(key)] = Number(value)
        }
      })
    }
    if (object.settlements !== undefined && object.settlements !== null) {
      Object.entries(object.settlements).forEach(([key, value]) => {
        if (value !== undefined) {
          message.settlements[Number(key)] = value as number
        }
      })
    }
    return message
  }
}

const baseFaction_PopulationEntry: object = { key: 0, value: 0 }

export const Faction_PopulationEntry = {
  encode(message: Faction_PopulationEntry, writer: Writer = Writer.create()): Writer {
    if (message.key !== 0) {
      writer.uint32(8).uint32(message.key)
    }
    if (message.value !== 0) {
      writer.uint32(16).uint32(message.value)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Faction_PopulationEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseFaction_PopulationEntry } as Faction_PopulationEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.uint32()
          break
        case 2:
          message.value = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Faction_PopulationEntry {
    const message = { ...baseFaction_PopulationEntry } as Faction_PopulationEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = Number(object.key)
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Number(object.value)
    } else {
      message.value = 0
    }
    return message
  },

  toJSON(message: Faction_PopulationEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value)
    return obj
  },

  fromPartial(object: DeepPartial<Faction_PopulationEntry>): Faction_PopulationEntry {
    const message = { ...baseFaction_PopulationEntry } as Faction_PopulationEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value
    } else {
      message.value = 0
    }
    return message
  }
}

const baseFaction_SettlementsEntry: object = { key: 0, value: 0 }

export const Faction_SettlementsEntry = {
  encode(message: Faction_SettlementsEntry, writer: Writer = Writer.create()): Writer {
    if (message.key !== 0) {
      writer.uint32(8).uint32(message.key)
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Faction_SettlementsEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseFaction_SettlementsEntry } as Faction_SettlementsEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.uint32()
          break
        case 2:
          message.value = reader.int32() as any
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Faction_SettlementsEntry {
    const message = { ...baseFaction_SettlementsEntry } as Faction_SettlementsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = Number(object.key)
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = settlementFromJSON(object.value)
    } else {
      message.value = 0
    }
    return message
  },

  toJSON(message: Faction_SettlementsEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = settlementToJSON(message.value))
    return obj
  },

  fromPartial(object: DeepPartial<Faction_SettlementsEntry>): Faction_SettlementsEntry {
    const message = { ...baseFaction_SettlementsEntry } as Faction_SettlementsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value
    } else {
      message.value = 0
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
