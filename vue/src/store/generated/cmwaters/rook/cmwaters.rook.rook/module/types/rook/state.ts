/* eslint-disable */
import * as Long from 'long'
import { util, configure, Writer, Reader } from 'protobufjs/minimal'
import { Faction, Map } from '../rook/types'
import { GameConfig } from '../rook/config'

export const protobufPackage = 'cmwaters.rook.rook'

export interface Game {
  players: { [key: string]: Faction }
  config: GameConfig | undefined
  step: number
  map: Map | undefined
}

export interface Game_PlayersEntry {
  key: string
  value: Faction | undefined
}

const baseGame: object = { step: 0 }

export const Game = {
  encode(message: Game, writer: Writer = Writer.create()): Writer {
    Object.entries(message.players).forEach(([key, value]) => {
      Game_PlayersEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim()
    })
    if (message.config !== undefined) {
      GameConfig.encode(message.config, writer.uint32(18).fork()).ldelim()
    }
    if (message.step !== 0) {
      writer.uint32(24).uint64(message.step)
    }
    if (message.map !== undefined) {
      Map.encode(message.map, writer.uint32(34).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Game {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGame } as Game
    message.players = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = Game_PlayersEntry.decode(reader, reader.uint32())
          if (entry1.value !== undefined) {
            message.players[entry1.key] = entry1.value
          }
          break
        case 2:
          message.config = GameConfig.decode(reader, reader.uint32())
          break
        case 3:
          message.step = longToNumber(reader.uint64() as Long)
          break
        case 4:
          message.map = Map.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Game {
    const message = { ...baseGame } as Game
    message.players = {}
    if (object.players !== undefined && object.players !== null) {
      Object.entries(object.players).forEach(([key, value]) => {
        message.players[key] = Faction.fromJSON(value)
      })
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = GameConfig.fromJSON(object.config)
    } else {
      message.config = undefined
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = Number(object.step)
    } else {
      message.step = 0
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromJSON(object.map)
    } else {
      message.map = undefined
    }
    return message
  },

  toJSON(message: Game): unknown {
    const obj: any = {}
    obj.players = {}
    if (message.players) {
      Object.entries(message.players).forEach(([k, v]) => {
        obj.players[k] = Faction.toJSON(v)
      })
    }
    message.config !== undefined && (obj.config = message.config ? GameConfig.toJSON(message.config) : undefined)
    message.step !== undefined && (obj.step = message.step)
    message.map !== undefined && (obj.map = message.map ? Map.toJSON(message.map) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Game>): Game {
    const message = { ...baseGame } as Game
    message.players = {}
    if (object.players !== undefined && object.players !== null) {
      Object.entries(object.players).forEach(([key, value]) => {
        if (value !== undefined) {
          message.players[key] = Faction.fromPartial(value)
        }
      })
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = GameConfig.fromPartial(object.config)
    } else {
      message.config = undefined
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = object.step
    } else {
      message.step = 0
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromPartial(object.map)
    } else {
      message.map = undefined
    }
    return message
  }
}

const baseGame_PlayersEntry: object = { key: '' }

export const Game_PlayersEntry = {
  encode(message: Game_PlayersEntry, writer: Writer = Writer.create()): Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== undefined) {
      Faction.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): Game_PlayersEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGame_PlayersEntry } as Game_PlayersEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string()
          break
        case 2:
          message.value = Faction.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Game_PlayersEntry {
    const message = { ...baseGame_PlayersEntry } as Game_PlayersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key)
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Faction.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: Game_PlayersEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value ? Faction.toJSON(message.value) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<Game_PlayersEntry>): Game_PlayersEntry {
    const message = { ...baseGame_PlayersEntry } as Game_PlayersEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = ''
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Faction.fromPartial(object.value)
    } else {
      message.value = undefined
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
