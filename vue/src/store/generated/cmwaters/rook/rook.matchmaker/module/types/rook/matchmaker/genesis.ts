/* eslint-disable */
import * as Long from 'long'
import { util, configure, Writer, Reader } from 'protobufjs/minimal'
import { Params } from '../../rook/matchmaker/matchmaker'

export const protobufPackage = 'rook.matchmaker'

/** GenesisState defines the matchmaker module's genesis state. */
export interface GenesisState {
  params: Params | undefined
  nextModeId: number
  nextRoomId: number
}

const baseGenesisState: object = { nextModeId: 0, nextRoomId: 0 }

export const GenesisState = {
  encode(message: GenesisState, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim()
    }
    if (message.nextModeId !== 0) {
      writer.uint32(16).uint32(message.nextModeId)
    }
    if (message.nextRoomId !== 0) {
      writer.uint32(24).uint64(message.nextRoomId)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseGenesisState } as GenesisState
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32())
          break
        case 2:
          message.nextModeId = reader.uint32()
          break
        case 3:
          message.nextRoomId = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): GenesisState {
    const message = { ...baseGenesisState } as GenesisState
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params)
    } else {
      message.params = undefined
    }
    if (object.nextModeId !== undefined && object.nextModeId !== null) {
      message.nextModeId = Number(object.nextModeId)
    } else {
      message.nextModeId = 0
    }
    if (object.nextRoomId !== undefined && object.nextRoomId !== null) {
      message.nextRoomId = Number(object.nextRoomId)
    } else {
      message.nextRoomId = 0
    }
    return message
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {}
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined)
    message.nextModeId !== undefined && (obj.nextModeId = message.nextModeId)
    message.nextRoomId !== undefined && (obj.nextRoomId = message.nextRoomId)
    return obj
  },

  fromPartial(object: DeepPartial<GenesisState>): GenesisState {
    const message = { ...baseGenesisState } as GenesisState
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params)
    } else {
      message.params = undefined
    }
    if (object.nextModeId !== undefined && object.nextModeId !== null) {
      message.nextModeId = object.nextModeId
    } else {
      message.nextModeId = 0
    }
    if (object.nextRoomId !== undefined && object.nextRoomId !== null) {
      message.nextRoomId = object.nextRoomId
    } else {
      message.nextRoomId = 0
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
