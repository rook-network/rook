/* eslint-disable */
import { Reader, Writer } from 'protobufjs/minimal'

export const protobufPackage = 'cmwaters.rook.rook'

/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgMove {
  creator: string
  gameId: string
  position: string
  direction: string
  population: string
}

export interface MsgMoveResponse {}

export interface MsgBuild {
  creator: string
  gameId: string
  settlement: string
  position: string
}

export interface MsgBuildResponse {}

const baseMsgMove: object = { creator: '', gameId: '', position: '', direction: '', population: '' }

export const MsgMove = {
  encode(message: MsgMove, writer: Writer = Writer.create()): Writer {
    if (message.creator !== '') {
      writer.uint32(10).string(message.creator)
    }
    if (message.gameId !== '') {
      writer.uint32(18).string(message.gameId)
    }
    if (message.position !== '') {
      writer.uint32(26).string(message.position)
    }
    if (message.direction !== '') {
      writer.uint32(34).string(message.direction)
    }
    if (message.population !== '') {
      writer.uint32(42).string(message.population)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): MsgMove {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgMove } as MsgMove
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string()
          break
        case 2:
          message.gameId = reader.string()
          break
        case 3:
          message.position = reader.string()
          break
        case 4:
          message.direction = reader.string()
          break
        case 5:
          message.population = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgMove {
    const message = { ...baseMsgMove } as MsgMove
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator)
    } else {
      message.creator = ''
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = String(object.gameId)
    } else {
      message.gameId = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = String(object.position)
    } else {
      message.position = ''
    }
    if (object.direction !== undefined && object.direction !== null) {
      message.direction = String(object.direction)
    } else {
      message.direction = ''
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = String(object.population)
    } else {
      message.population = ''
    }
    return message
  },

  toJSON(message: MsgMove): unknown {
    const obj: any = {}
    message.creator !== undefined && (obj.creator = message.creator)
    message.gameId !== undefined && (obj.gameId = message.gameId)
    message.position !== undefined && (obj.position = message.position)
    message.direction !== undefined && (obj.direction = message.direction)
    message.population !== undefined && (obj.population = message.population)
    return obj
  },

  fromPartial(object: DeepPartial<MsgMove>): MsgMove {
    const message = { ...baseMsgMove } as MsgMove
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator
    } else {
      message.creator = ''
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId
    } else {
      message.gameId = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position
    } else {
      message.position = ''
    }
    if (object.direction !== undefined && object.direction !== null) {
      message.direction = object.direction
    } else {
      message.direction = ''
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = object.population
    } else {
      message.population = ''
    }
    return message
  }
}

const baseMsgMoveResponse: object = {}

export const MsgMoveResponse = {
  encode(_: MsgMoveResponse, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): MsgMoveResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse
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

  fromJSON(_: any): MsgMoveResponse {
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse
    return message
  },

  toJSON(_: MsgMoveResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<MsgMoveResponse>): MsgMoveResponse {
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse
    return message
  }
}

const baseMsgBuild: object = { creator: '', gameId: '', settlement: '', position: '' }

export const MsgBuild = {
  encode(message: MsgBuild, writer: Writer = Writer.create()): Writer {
    if (message.creator !== '') {
      writer.uint32(10).string(message.creator)
    }
    if (message.gameId !== '') {
      writer.uint32(18).string(message.gameId)
    }
    if (message.settlement !== '') {
      writer.uint32(26).string(message.settlement)
    }
    if (message.position !== '') {
      writer.uint32(34).string(message.position)
    }
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): MsgBuild {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgBuild } as MsgBuild
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string()
          break
        case 2:
          message.gameId = reader.string()
          break
        case 3:
          message.settlement = reader.string()
          break
        case 4:
          message.position = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgBuild {
    const message = { ...baseMsgBuild } as MsgBuild
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = String(object.creator)
    } else {
      message.creator = ''
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = String(object.gameId)
    } else {
      message.gameId = ''
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = String(object.settlement)
    } else {
      message.settlement = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = String(object.position)
    } else {
      message.position = ''
    }
    return message
  },

  toJSON(message: MsgBuild): unknown {
    const obj: any = {}
    message.creator !== undefined && (obj.creator = message.creator)
    message.gameId !== undefined && (obj.gameId = message.gameId)
    message.settlement !== undefined && (obj.settlement = message.settlement)
    message.position !== undefined && (obj.position = message.position)
    return obj
  },

  fromPartial(object: DeepPartial<MsgBuild>): MsgBuild {
    const message = { ...baseMsgBuild } as MsgBuild
    if (object.creator !== undefined && object.creator !== null) {
      message.creator = object.creator
    } else {
      message.creator = ''
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId
    } else {
      message.gameId = ''
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = object.settlement
    } else {
      message.settlement = ''
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = object.position
    } else {
      message.position = ''
    }
    return message
  }
}

const baseMsgBuildResponse: object = {}

export const MsgBuildResponse = {
  encode(_: MsgBuildResponse, writer: Writer = Writer.create()): Writer {
    return writer
  },

  decode(input: Reader | Uint8Array, length?: number): MsgBuildResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input
    let end = length === undefined ? reader.len : reader.pos + length
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse
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

  fromJSON(_: any): MsgBuildResponse {
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse
    return message
  },

  toJSON(_: MsgBuildResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial(_: DeepPartial<MsgBuildResponse>): MsgBuildResponse {
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse
    return message
  }
}

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  Move(request: MsgMove): Promise<MsgMoveResponse>
  Build(request: MsgBuild): Promise<MsgBuildResponse>
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc
  constructor(rpc: Rpc) {
    this.rpc = rpc
  }
  Move(request: MsgMove): Promise<MsgMoveResponse> {
    const data = MsgMove.encode(request).finish()
    const promise = this.rpc.request('cmwaters.rook.rook.Msg', 'Move', data)
    return promise.then((data) => MsgMoveResponse.decode(new Reader(data)))
  }

  Build(request: MsgBuild): Promise<MsgBuildResponse> {
    const data = MsgBuild.encode(request).finish()
    const promise = this.rpc.request('cmwaters.rook.rook.Msg', 'Build', data)
    return promise.then((data) => MsgBuildResponse.decode(new Reader(data)))
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>
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
