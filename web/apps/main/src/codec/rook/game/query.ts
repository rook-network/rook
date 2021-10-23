/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { State, Overview, Params } from "./game";

export const protobufPackage = "rook.game";

/** this line is used by starport scaffolding # 3 */
export interface QueryGetGameStateRequest {
  id: Long;
}

export interface QueryGetGameStateResponse {
  state?: State;
}

export interface QueryGetGameRequest {
  id: Long;
}

export interface QueryGetGameResponse {
  overview?: Overview;
  id: Long;
}

export interface QueryGetParamsRequest {
  version: number;
}

export interface QueryGetParamsResponse {
  params?: Params;
  version: number;
}

const baseQueryGetGameStateRequest: object = { id: Long.UZERO };

export const QueryGetGameStateRequest = {
  encode(
    message: QueryGetGameStateRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetGameStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetGameStateRequest,
    } as QueryGetGameStateRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGameStateRequest {
    const message = {
      ...baseQueryGetGameStateRequest,
    } as QueryGetGameStateRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGetGameStateRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetGameStateRequest>
  ): QueryGetGameStateRequest {
    const message = {
      ...baseQueryGetGameStateRequest,
    } as QueryGetGameStateRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGetGameStateResponse: object = {};

export const QueryGetGameStateResponse = {
  encode(
    message: QueryGetGameStateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.state !== undefined) {
      State.encode(message.state, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetGameStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetGameStateResponse,
    } as QueryGetGameStateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.state = State.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGameStateResponse {
    const message = {
      ...baseQueryGetGameStateResponse,
    } as QueryGetGameStateResponse;
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromJSON(object.state);
    } else {
      message.state = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetGameStateResponse): unknown {
    const obj: any = {};
    message.state !== undefined &&
      (obj.state = message.state ? State.toJSON(message.state) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetGameStateResponse>
  ): QueryGetGameStateResponse {
    const message = {
      ...baseQueryGetGameStateResponse,
    } as QueryGetGameStateResponse;
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromPartial(object.state);
    } else {
      message.state = undefined;
    }
    return message;
  },
};

const baseQueryGetGameRequest: object = { id: Long.UZERO };

export const QueryGetGameRequest = {
  encode(
    message: QueryGetGameRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetGameRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGameRequest {
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGetGameRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGetGameRequest>): QueryGetGameRequest {
    const message = { ...baseQueryGetGameRequest } as QueryGetGameRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGetGameResponse: object = { id: Long.UZERO };

export const QueryGetGameResponse = {
  encode(
    message: QueryGetGameResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.overview !== undefined) {
      Overview.encode(message.overview, writer.uint32(10).fork()).ldelim();
    }
    if (!message.id.isZero()) {
      writer.uint32(16).uint64(message.id);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetGameResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.overview = Overview.decode(reader, reader.uint32());
          break;
        case 2:
          message.id = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGameResponse {
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse;
    if (object.overview !== undefined && object.overview !== null) {
      message.overview = Overview.fromJSON(object.overview);
    } else {
      message.overview = undefined;
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGetGameResponse): unknown {
    const obj: any = {};
    message.overview !== undefined &&
      (obj.overview = message.overview
        ? Overview.toJSON(message.overview)
        : undefined);
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGetGameResponse>): QueryGetGameResponse {
    const message = { ...baseQueryGetGameResponse } as QueryGetGameResponse;
    if (object.overview !== undefined && object.overview !== null) {
      message.overview = Overview.fromPartial(object.overview);
    } else {
      message.overview = undefined;
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGetParamsRequest: object = { version: 0 };

export const QueryGetParamsRequest = {
  encode(
    message: QueryGetParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest;
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version);
    } else {
      message.version = 0;
    }
    return message;
  },

  toJSON(message: QueryGetParamsRequest): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetParamsRequest>
  ): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest;
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    } else {
      message.version = 0;
    }
    return message;
  },
};

const baseQueryGetParamsResponse: object = { version: 0 };

export const QueryGetParamsResponse = {
  encode(
    message: QueryGetParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.version !== 0) {
      writer.uint32(16).uint32(message.version);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.version = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetParamsResponse {
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromJSON(object.params);
    } else {
      message.params = undefined;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version);
    } else {
      message.version = 0;
    }
    return message;
  },

  toJSON(message: QueryGetParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetParamsResponse>
  ): QueryGetParamsResponse {
    const message = { ...baseQueryGetParamsResponse } as QueryGetParamsResponse;
    if (object.params !== undefined && object.params !== null) {
      message.params = Params.fromPartial(object.params);
    } else {
      message.params = undefined;
    }
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    } else {
      message.version = 0;
    }
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Queries a game state by id. */
  GameState(
    request: QueryGetGameStateRequest
  ): Promise<QueryGetGameStateResponse>;
  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>;
  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.GameState = this.GameState.bind(this);
    this.Game = this.Game.bind(this);
    this.Params = this.Params.bind(this);
  }
  GameState(
    request: QueryGetGameStateRequest
  ): Promise<QueryGetGameStateResponse> {
    const data = QueryGetGameStateRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "GameState", data);
    return promise.then((data) =>
      QueryGetGameStateResponse.decode(new _m0.Reader(data))
    );
  }

  Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse> {
    const data = QueryGetGameRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "Game", data);
    return promise.then((data) =>
      QueryGetGameResponse.decode(new _m0.Reader(data))
    );
  }

  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse> {
    const data = QueryGetParamsRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "Params", data);
    return promise.then((data) =>
      QueryGetParamsResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined
  | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
