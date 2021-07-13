/* eslint-disable */
import { Reader, util, configure, Writer } from 'protobufjs/minimal'
import * as Long from 'long'
import { Game } from '../rook/state'
import { Params } from '../rook/config'

export const protobufPackage = 'cmwaters.rook.rook'

/** this line is used by starport scaffolding # 3 */
export interface QueryGetGameRequest {
  id: number
}

export interface QueryGetGameResponse {
  game: Game | undefined
}

export interface QueryGetParamsRequest {}

export interface QueryGetParamsResponse {
  params: Params | undefined
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

const baseQueryGetGameResponse: object = {}

export const QueryGetGameResponse = {
  encode(message: QueryGetGameResponse, writer: Writer = Writer.create()): Writer {
    if (message.game !== undefined) {
      Game.encode(message.game, writer.uint32(10).fork()).ldelim()
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): QueryGetGameResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.game = Game.decode(reader, reader.uint32())
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
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromJSON(object.game)
    } else {
      message.game = undefined
    }
    return message
  },

  toJSON(message: QueryGetGameResponse): unknown {
    const obj: any = {}
    message.game !== undefined && (obj.game = message.game ? Game.toJSON(message.game) : undefined)
    return obj
  },

  fromPartial(object: DeepPartial<QueryGetGameResponse>): QueryGetGameResponse {
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromPartial(object.game)
    } else {
      message.game = undefined
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
  /** Queries a game state by id. */
  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>
  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc
  constructor(rpc: Rpc) {
    this.rpc = rpc
  }
  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse> {
    const data = QueryGetGameRequest.encode(request).finish()
    const promise = this.rpc.request('cmwaters.rook.rook.Query', 'Game', data)
    return promise.then((data) => QueryGetGameResponse.decode(new Reader(data)))
  }

  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse> {
    const data = QueryGetParamsRequest.encode(request).finish()
    const promise = this.rpc.request('cmwaters.rook.rook.Query', 'Params', data)
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
