/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { State, Game } from "../../rook/game/game";
import { Params } from "../../rook/game/config";

export const protobufPackage = "rook.game";

/** this line is used by starport scaffolding # 3 */
export interface QueryGameStateRequest {
  id: Long;
}

export interface QueryGameStateResponse {
  state?: State;
}

export interface QueryGameByIDRequest {
  id: Long;
}

export interface QueryGameByIDResponse {
  game?: Game;
}

export interface QueryGameByPlayerRequest {
  player: string;
}

export interface QueryGameByPlayerResponse {
  game?: Game;
}

export interface QueryParamsRequest {
  version: number;
}

export interface QueryParamsResponse {
  params?: Params;
  version: number;
}

const baseQueryGameStateRequest: object = { id: Long.UZERO };

export const QueryGameStateRequest = {
  encode(
    message: QueryGameStateRequest,
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
  ): QueryGameStateRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGameStateRequest } as QueryGameStateRequest;
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

  fromJSON(object: any): QueryGameStateRequest {
    const message = { ...baseQueryGameStateRequest } as QueryGameStateRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGameStateRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGameStateRequest>
  ): QueryGameStateRequest {
    const message = { ...baseQueryGameStateRequest } as QueryGameStateRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGameStateResponse: object = {};

export const QueryGameStateResponse = {
  encode(
    message: QueryGameStateResponse,
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
  ): QueryGameStateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGameStateResponse } as QueryGameStateResponse;
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

  fromJSON(object: any): QueryGameStateResponse {
    const message = { ...baseQueryGameStateResponse } as QueryGameStateResponse;
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromJSON(object.state);
    } else {
      message.state = undefined;
    }
    return message;
  },

  toJSON(message: QueryGameStateResponse): unknown {
    const obj: any = {};
    message.state !== undefined &&
      (obj.state = message.state ? State.toJSON(message.state) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGameStateResponse>
  ): QueryGameStateResponse {
    const message = { ...baseQueryGameStateResponse } as QueryGameStateResponse;
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromPartial(object.state);
    } else {
      message.state = undefined;
    }
    return message;
  },
};

const baseQueryGameByIDRequest: object = { id: Long.UZERO };

export const QueryGameByIDRequest = {
  encode(
    message: QueryGameByIDRequest,
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
  ): QueryGameByIDRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGameByIDRequest } as QueryGameByIDRequest;
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

  fromJSON(object: any): QueryGameByIDRequest {
    const message = { ...baseQueryGameByIDRequest } as QueryGameByIDRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGameByIDRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGameByIDRequest>): QueryGameByIDRequest {
    const message = { ...baseQueryGameByIDRequest } as QueryGameByIDRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGameByIDResponse: object = {};

export const QueryGameByIDResponse = {
  encode(
    message: QueryGameByIDResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.game !== undefined) {
      Game.encode(message.game, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGameByIDResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGameByIDResponse } as QueryGameByIDResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.game = Game.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGameByIDResponse {
    const message = { ...baseQueryGameByIDResponse } as QueryGameByIDResponse;
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromJSON(object.game);
    } else {
      message.game = undefined;
    }
    return message;
  },

  toJSON(message: QueryGameByIDResponse): unknown {
    const obj: any = {};
    message.game !== undefined &&
      (obj.game = message.game ? Game.toJSON(message.game) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGameByIDResponse>
  ): QueryGameByIDResponse {
    const message = { ...baseQueryGameByIDResponse } as QueryGameByIDResponse;
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromPartial(object.game);
    } else {
      message.game = undefined;
    }
    return message;
  },
};

const baseQueryGameByPlayerRequest: object = { player: "" };

export const QueryGameByPlayerRequest = {
  encode(
    message: QueryGameByPlayerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.player !== "") {
      writer.uint32(10).string(message.player);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGameByPlayerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGameByPlayerRequest,
    } as QueryGameByPlayerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGameByPlayerRequest {
    const message = {
      ...baseQueryGameByPlayerRequest,
    } as QueryGameByPlayerRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    return message;
  },

  toJSON(message: QueryGameByPlayerRequest): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGameByPlayerRequest>
  ): QueryGameByPlayerRequest {
    const message = {
      ...baseQueryGameByPlayerRequest,
    } as QueryGameByPlayerRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    return message;
  },
};

const baseQueryGameByPlayerResponse: object = {};

export const QueryGameByPlayerResponse = {
  encode(
    message: QueryGameByPlayerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.game !== undefined) {
      Game.encode(message.game, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGameByPlayerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGameByPlayerResponse,
    } as QueryGameByPlayerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.game = Game.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGameByPlayerResponse {
    const message = {
      ...baseQueryGameByPlayerResponse,
    } as QueryGameByPlayerResponse;
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromJSON(object.game);
    } else {
      message.game = undefined;
    }
    return message;
  },

  toJSON(message: QueryGameByPlayerResponse): unknown {
    const obj: any = {};
    message.game !== undefined &&
      (obj.game = message.game ? Game.toJSON(message.game) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGameByPlayerResponse>
  ): QueryGameByPlayerResponse {
    const message = {
      ...baseQueryGameByPlayerResponse,
    } as QueryGameByPlayerResponse;
    if (object.game !== undefined && object.game !== null) {
      message.game = Game.fromPartial(object.game);
    } else {
      message.game = undefined;
    }
    return message;
  },
};

const baseQueryParamsRequest: object = { version: 0 };

export const QueryParamsRequest = {
  encode(
    message: QueryParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
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

  fromJSON(object: any): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    if (object.version !== undefined && object.version !== null) {
      message.version = Number(object.version);
    } else {
      message.version = 0;
    }
    return message;
  },

  toJSON(message: QueryParamsRequest): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsRequest>): QueryParamsRequest {
    const message = { ...baseQueryParamsRequest } as QueryParamsRequest;
    if (object.version !== undefined && object.version !== null) {
      message.version = object.version;
    } else {
      message.version = 0;
    }
    return message;
  },
};

const baseQueryParamsResponse: object = { version: 0 };

export const QueryParamsResponse = {
  encode(
    message: QueryParamsResponse,
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

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
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

  fromJSON(object: any): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
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

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryParamsResponse>): QueryParamsResponse {
    const message = { ...baseQueryParamsResponse } as QueryParamsResponse;
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
  Game(request: QueryGameByIDRequest): Promise<QueryGameByIDResponse>;
  GameByPlayer(
    request: QueryGameByPlayerRequest
  ): Promise<QueryGameByPlayerResponse>;
  /** Queries a game state by id. */
  State(request: QueryGameStateRequest): Promise<QueryGameStateResponse>;
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Game = this.Game.bind(this);
    this.GameByPlayer = this.GameByPlayer.bind(this);
    this.State = this.State.bind(this);
    this.Params = this.Params.bind(this);
  }
  Game(request: QueryGameByIDRequest): Promise<QueryGameByIDResponse> {
    const data = QueryGameByIDRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "Game", data);
    return promise.then((data) =>
      QueryGameByIDResponse.decode(new _m0.Reader(data))
    );
  }

  GameByPlayer(
    request: QueryGameByPlayerRequest
  ): Promise<QueryGameByPlayerResponse> {
    const data = QueryGameByPlayerRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "GameByPlayer", data);
    return promise.then((data) =>
      QueryGameByPlayerResponse.decode(new _m0.Reader(data))
    );
  }

  State(request: QueryGameStateRequest): Promise<QueryGameStateResponse> {
    const data = QueryGameStateRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "State", data);
    return promise.then((data) =>
      QueryGameStateResponse.decode(new _m0.Reader(data))
    );
  }

  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("rook.game.Query", "Params", data);
    return promise.then((data) =>
      QueryParamsResponse.decode(new _m0.Reader(data))
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
