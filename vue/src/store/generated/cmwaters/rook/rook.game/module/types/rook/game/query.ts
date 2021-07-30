/* eslint-disable */
import { Reader, util, configure, Writer } from 'protobufjs/minimal'
import * as Long from 'long'
import { State, Overview, Params } from '../../rook/game/game'

export const protobufPackage = 'rook.game'

/** this line is used by starport scaffolding # 3 */
export interface QueryGetGameStateRequest {
  id: number
}

export interface QueryGetGameStateResponse {
  gameState: State | undefined
}

export interface QueryGetGameRequest {
  id: number
}

export interface QueryGetGameResponse {
  players: string[]
  overview: Overview | undefined
}

export interface QueryGetParamsRequest {
  version: number
}

export interface QueryGetParamsResponse {
  params: Params | undefined
}

const baseQueryGetGameStateRequest: object = { id: 0 }

export const QueryGetGameStateRequest = {
  encode(message: QueryGetGameStateRequest, writer: Writer = Writer.create()): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetGameStateRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetGameStateRequest } as QueryGetGameStateRequest
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

  fromJSON(object: any): QueryGetGameStateRequest {
    const message = { ...baseQueryGetGameStateRequest } as QueryGetGameStateRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id)
    } else {
      message.id = 0
    }
    return message
  },

  toJSON(message: QueryGetGameStateRequest): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetGameStateRequest>): QueryGetGameStateRequest {
    const message = { ...baseQueryGetGameStateRequest } as QueryGetGameStateRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id
    } else {
      message.id = 0
    }
    return message
  }
}

const baseQueryGetGameStateResponse: object = {}

export const QueryGetGameStateResponse = {
  encode(message: QueryGetGameStateResponse, writer: Writer = Writer.create()): Writer {
    if (message.gameState !== undefined) {
      State.encode(message.gameState, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetGameStateResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetGameStateResponse } as QueryGetGameStateResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.gameState = State.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetGameStateResponse {
    const message = { ...baseQueryGetGameStateResponse } as QueryGetGameStateResponse
    if (object.gameState !== undefined && object.gameState !== null) {
      message.gameState = State.fromJSON(object.gameState)
    } else {
      message.gameState = undefined
    }
    return message
  },

  toJSON(message: QueryGetGameStateResponse): unknown {
    const obj: any = {}
    message.gameState !== undefined && (obj.gameState = message.gameState ? State.toJSON(message.gameState) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetGameStateResponse>): QueryGetGameStateResponse {
    const message = { ...baseQueryGetGameStateResponse } as QueryGetGameStateResponse
    if (object.gameState !== undefined && object.gameState !== null) {
      message.gameState = State.fromPartial(object.gameState)
    } else {
      message.gameState = undefined
    }
    return message
  }
}

const baseQueryGetGameRequest: object = { id: 0 }

export const QueryGetGameRequest = {
  encode(message: QueryGetGameRequest, writer: Writer = Writer.create()): Writer {
    if (message.id !== 0) {
      writer.uint32(8).uint64(message.id)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetGameRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest
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

  fromJSON(object: any): QueryGetGameRequest {
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id)
    } else {
      message.id = 0
    }
    return message
  },

  toJSON(message: QueryGetGameRequest): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetGameRequest>): QueryGetGameRequest {
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id
    } else {
      message.id = 0
    }
    return message
  }
}

const baseQueryGetGameResponse: object = { players: '' }

export const QueryGetGameResponse = {
  encode(message: QueryGetGameResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.players) {
      writer.uint32(10).string(v!)
    }
    if (message.overview !== undefined) {
      Overview.encode(message.overview, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetGameResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse
    message.players = []
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.players.push(reader.string())
          break
        case 2:
          message.overview = Overview.decode(reader, reader.uint32())
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetGameResponse {
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse
    message.players = []
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(String(e))
      }
    }
    if (object.overview !== undefined && object.overview !== null) {
      message.overview = Overview.fromJSON(object.overview)
    } else {
      message.overview = undefined
    }
    return message
  },

  toJSON(message: QueryGetGameResponse): unknown {
    const obj: any = {}
    if (message.players) {
      obj.players = message.players.map((e) => e)
    } else {
      obj.players = []
    }
    message.overview !== undefined && (obj.overview = message.overview ? Overview.toJSON(message.overview) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetGameResponse>): QueryGetGameResponse {
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse
    message.players = []
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(e)
      }
    }
    if (object.overview !== undefined && object.overview !== null) {
      message.overview = Overview.fromPartial(object.overview)
    } else {
      message.overview = undefined
    }
    return message
  }
}

const baseQueryGetParamsRequest: object = { version: 0 }

export const QueryGetParamsRequest = {
  encode(message: QueryGetParamsRequest, writer: Writer = Writer.create()): Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetParamsRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version)
    } else {
      message.version = 0
    }
    return message
  },

  toJSON(message: QueryGetParamsRequest): unknown {
    const obj: any = {}
    message.version !== undefined && (obj.version = message.version)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetParamsRequest>): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version
    } else {
      message.version = 0
    }
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
  /** Queries a game state by id. */
  GameState(request: QueryGetGameStateRequest): Promise<QueryGetGameStateResponse>
  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>
  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc
  constructor(rpc: Rpc) {
    this.rpc = rpc
  }
  GameState(request: QueryGetGameStateRequest): Promise<QueryGetGameStateResponse> {
    const data = QueryGetGameStateRequest.encode(request).finish()
    const promise = this.rpc.request('rook.game.Query', 'GameState', data)
    return promise.then((data) => QueryGetGameStateResponse.decode(new Reader(data)))
  }

  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse> {
    const data = QueryGetGameRequest.encode(request).finish()
    const promise = this.rpc.request('rook.game.Query', 'Game', data)
    return promise.then((data) => QueryGetGameResponse.decode(new Reader(data)))
  }

  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse> {
    const data = QueryGetParamsRequest.encode(request).finish()
    const promise = this.rpc.request('rook.game.Query', 'Params', data)
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
