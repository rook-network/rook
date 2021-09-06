/* eslint-disable */
import { Reader, util, configure, Writer } from 'protobufjs/minimal'
import * as Long from 'long'
import { Room, Mode, Params } from '../../rook/matchmaker/matchmaker'

export const protobufPackage = 'rook.matchmaker'

export interface QueryGetRoomRequest {
  id: number
}

export interface QueryGetRoomResponse {
  room: Room | undefined
}

export interface QueryGetInvitationsRequest {
  player: string
}

export interface QueryGetInvitationsResponse {
  rooms: { [key: number]: Room }
}

export interface QueryGetInvitationsResponse_RoomsEntry {
  key: number
  value: Room | undefined
}

export interface QueryGetModesRequest {}

export interface QueryGetModesResponse {
  modes: { [key: number]: Mode }
}

export interface QueryGetModesResponse_ModesEntry {
  key: number
  value: Mode | undefined
}

export interface QueryGetParamsRequest {}

export interface QueryGetParamsResponse {
  params: Params | undefined
}

const baseQueryGetRoomRequest: object = { id: 0 }

export const QueryGetRoomRequest = {
  encode(message: QueryGetRoomRequest, writer: Writer = Writer.create()): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetRoomRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetRoomRequest {
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id)
    } else {
      message.id = 0
    }
    return message
  },

  toJSON(message: QueryGetRoomRequest): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetRoomRequest>): QueryGetRoomRequest {
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id
    } else {
      message.id = 0
    }
    return message
  }
}

const baseQueryGetRoomResponse: object = {}

export const QueryGetRoomResponse = {
  encode(message: QueryGetRoomResponse, writer: Writer = Writer.create()): Writer {
    if (message.room !== undefined) {
      Room.encode(message.room, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetRoomResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.room = Room.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetRoomResponse {
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromJSON(object.room)
    } else {
      message.room = undefined
    }
    return message
  },

  toJSON(message: QueryGetRoomResponse): unknown {
    const obj: any = {}
    message.room !== undefined && (obj.room = message.room ? Room.toJSON(message.room) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetRoomResponse>): QueryGetRoomResponse {
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromPartial(object.room)
    } else {
      message.room = undefined
    }
    return message
  }
}

const baseQueryGetInvitationsRequest: object = { player: '' }

export const QueryGetInvitationsRequest = {
  encode(message: QueryGetInvitationsRequest, writer: Writer = Writer.create()): Writer {
    if (message.player !== '') {
      writer.uint32(10).string(message.player)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetInvitationsRequest } as QueryGetInvitationsRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetInvitationsRequest {
    const message = { ...baseQueryGetInvitationsRequest } as QueryGetInvitationsRequest
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player)
    } else {
      message.player = ''
    }
    return message
  },

  toJSON(message: QueryGetInvitationsRequest): unknown {
    const obj: any = {}
    message.player !== undefined && (obj.player = message.player)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetInvitationsRequest>): QueryGetInvitationsRequest {
    const message = { ...baseQueryGetInvitationsRequest } as QueryGetInvitationsRequest
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player
    } else {
      message.player = ''
    }
    return message
  }
}

const baseQueryGetInvitationsResponse: object = {}

export const QueryGetInvitationsResponse = {
  encode(message: QueryGetInvitationsResponse, writer: Writer = Writer.create()): Writer {
    Object.entries(message.rooms).forEach(([key, value]) => {
      QueryGetInvitationsResponse_RoomsEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim()
    })
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetInvitationsResponse } as QueryGetInvitationsResponse
    message.rooms = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = QueryGetInvitationsResponse_RoomsEntry.decode(reader, reader.uint32())
          if (entry1.value !== undefined) {
            message.rooms[entry1.key] = entry1.value
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetInvitationsResponse {
    const message = { ...baseQueryGetInvitationsResponse } as QueryGetInvitationsResponse
    message.rooms = {}
    if (object.rooms !== undefined && object.rooms !== null) {
      Object.entries(object.rooms).forEach(([key, value]) => {
        message.rooms[Number(key)] = Room.fromJSON(value)
      })
    }
    return message
  },

  toJSON(message: QueryGetInvitationsResponse): unknown {
    const obj: any = {}
    obj.rooms = {}
    if (message.rooms) {
      Object.entries(message.rooms).forEach(([k, v]) => {
        obj.rooms[k] = Room.toJSON(v)
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetInvitationsResponse>): QueryGetInvitationsResponse {
    const message = { ...baseQueryGetInvitationsResponse } as QueryGetInvitationsResponse
    message.rooms = {}
    if (object.rooms !== undefined && object.rooms !== null) {
      Object.entries(object.rooms).forEach(([key, value]) => {
        if (value !== undefined) {
          message.rooms[Number(key)] = Room.fromPartial(value)
        }
      })
    }
    return message
  }
}

const baseQueryGetInvitationsResponse_RoomsEntry: object = { key: 0 }

export const QueryGetInvitationsResponse_RoomsEntry = {
  encode(message: QueryGetInvitationsResponse_RoomsEntry, writer: Writer = Writer.create()): Writer {
    if (message.key !== 0) {
      writer.uint32(8).uint64(message.key)
    }
    if (message.value !== undefined) {
      Room.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsResponse_RoomsEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetInvitationsResponse_RoomsEntry } as QueryGetInvitationsResponse_RoomsEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.value = Room.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetInvitationsResponse_RoomsEntry {
    const message = { ...baseQueryGetInvitationsResponse_RoomsEntry } as QueryGetInvitationsResponse_RoomsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = Number(object.key)
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Room.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: QueryGetInvitationsResponse_RoomsEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value ? Room.toJSON(message.value) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetInvitationsResponse_RoomsEntry>): QueryGetInvitationsResponse_RoomsEntry {
    const message = { ...baseQueryGetInvitationsResponse_RoomsEntry } as QueryGetInvitationsResponse_RoomsEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Room.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  }
}

const baseQueryGetModesRequest: object = {}

export const QueryGetModesRequest = {
  encode(_: QueryGetModesRequest, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetModesRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): QueryGetModesRequest {
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest
    return message
  },

  toJSON(_: QueryGetModesRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<QueryGetModesRequest>): QueryGetModesRequest {
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest
    return message
  }
}

const baseQueryGetModesResponse: object = {}

export const QueryGetModesResponse = {
  encode(message: QueryGetModesResponse, writer: Writer = Writer.create()): Writer {
    Object.entries(message.modes).forEach(([key, value]) => {
      QueryGetModesResponse_ModesEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim()
    })
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetModesResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse
    message.modes = {}
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          const entry1 = QueryGetModesResponse_ModesEntry.decode(reader, reader.uint32())
          if (entry1.value !== undefined) {
            message.modes[entry1.key] = entry1.value
          }
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetModesResponse {
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse
    message.modes = {}
    if (object.modes !== undefined && object.modes !== null) {
      Object.entries(object.modes).forEach(([key, value]) => {
        message.modes[Number(key)] = Mode.fromJSON(value)
      })
    }
    return message
  },

  toJSON(message: QueryGetModesResponse): unknown {
    const obj: any = {}
    obj.modes = {}
    if (message.modes) {
      Object.entries(message.modes).forEach(([k, v]) => {
        obj.modes[k] = Mode.toJSON(v)
      })
    }
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetModesResponse>): QueryGetModesResponse {
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse
    message.modes = {}
    if (object.modes !== undefined && object.modes !== null) {
      Object.entries(object.modes).forEach(([key, value]) => {
        if (value !== undefined) {
          message.modes[Number(key)] = Mode.fromPartial(value)
        }
      })
    }
    return message
  }
}

const baseQueryGetModesResponse_ModesEntry: object = { key: 0 }

export const QueryGetModesResponse_ModesEntry = {
  encode(message: QueryGetModesResponse_ModesEntry, writer: Writer = Writer.create()): Writer {
    if (message.key !== 0) {
      writer.uint32(8).uint32(message.key)
    }
    if (message.value !== undefined) {
      Mode.encode(message.value, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetModesResponse_ModesEntry {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetModesResponse_ModesEntry } as QueryGetModesResponse_ModesEntry
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.key = reader.uint32()
          break
        case 2:
          message.value = Mode.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetModesResponse_ModesEntry {
    const message = { ...baseQueryGetModesResponse_ModesEntry } as QueryGetModesResponse_ModesEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = Number(object.key)
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Mode.fromJSON(object.value)
    } else {
      message.value = undefined
    }
    return message
  },

  toJSON(message: QueryGetModesResponse_ModesEntry): unknown {
    const obj: any = {}
    message.key !== undefined && (obj.key = message.key)
    message.value !== undefined && (obj.value = message.value ? Mode.toJSON(message.value) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetModesResponse_ModesEntry>): QueryGetModesResponse_ModesEntry {
    const message = { ...baseQueryGetModesResponse_ModesEntry } as QueryGetModesResponse_ModesEntry
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key
    } else {
      message.key = 0
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Mode.fromPartial(object.value)
    } else {
      message.value = undefined
    }
    return message
  }
}

const baseQueryGetParamsRequest: object = {}

export const QueryGetParamsRequest = {
  encode(_: QueryGetParamsRequest, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetParamsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    return message
  },

  toJSON(_: QueryGetParamsRequest): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<QueryGetParamsRequest>): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    return message
  }
}

const baseQueryGetParamsResponse: object = {}

export const QueryGetParamsResponse = {
  encode(message: QueryGetParamsResponse, writer: Writer = Writer.create()): Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetParamsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetParamsResponse {
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params)
    } else {
      message.params = undefined
    }
    return message
  },

  toJSON(message: QueryGetParamsResponse): unknown {
    const obj: any = {}
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetParamsResponse>): QueryGetParamsResponse {
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params)
    } else {
      message.params = undefined
    }
    return message
  }
}

/** Query defines the gRPC querier service. */
export interface Query {
  /** Room returns the current state of a specific room */
  Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse>
  /** Invitations lists all the rooms that a player is invited to */
  Invitations(request: QueryGetInvitationsRequest): Promise<QueryGetInvitationsResponse>
  /** Modes lists all the public available modes */
  Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse>
  /** Params lists the current matchmaker params */
  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc
  constructor(rpc: Rpc) {
    this.rpc = rpc
  }
  Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse> {
    const data = QueryGetRoomRequest.encode(request).finish()
    const promise = this.rpc.request('rook.matchmaker.Query', 'Room', data)
    return promise.then((data) => QueryGetRoomResponse.decode(new Reader(data)))
  }

  Invitations(request: QueryGetInvitationsRequest): Promise<QueryGetInvitationsResponse> {
    const data = QueryGetInvitationsRequest.encode(request).finish()
    const promise = this.rpc.request('rook.matchmaker.Query', 'Invitations', data)
    return promise.then((data) => QueryGetInvitationsResponse.decode(new Reader(data)))
  }

  Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse> {
    const data = QueryGetModesRequest.encode(request).finish()
    const promise = this.rpc.request('rook.matchmaker.Query', 'Modes', data)
    return promise.then((data) => QueryGetModesResponse.decode(new Reader(data)))
  }

  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse> {
    const data = QueryGetParamsRequest.encode(request).finish()
    const promise = this.rpc.request('rook.matchmaker.Query', 'Params', data)
    return promise.then((data) => QueryGetParamsResponse.decode(new Reader(data)))
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>
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
