/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  Direction,
  Settlement,
  directionFromJSON,
  directionToJSON,
  settlementFromJSON,
  settlementToJSON,
} from "../../rook/game/game";
import { Config, Params } from "../../rook/game/config";

export const protobufPackage = "rook.game";

export interface MsgMove {
  creator: string;
  gameId: Long;
  populace: number;
  direction: Direction;
  population: number;
}

export interface MsgMoveResponse {}

export interface MsgBuild {
  creator: string;
  gameId: Long;
  populace: number;
  settlement: Settlement;
}

export interface MsgBuildResponse {}

export interface MsgCreate {
  /** all players must be signers */
  players: string[];
  config?: Config;
}

export interface MsgCreateResponse {
  gameId: Long;
}

export interface MsgChangeParams {
  authority: string;
  params?: Params;
}

export interface MsgChangeParamsResponse {
  version: number;
}

const baseMsgMove: object = {
  creator: "",
  gameId: Long.UZERO,
  populace: 0,
  direction: 0,
  population: 0,
};

export const MsgMove = {
  encode(
    message: MsgMove,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (!message.gameId.isZero()) {
      writer.uint32(16).uint64(message.gameId);
    }
    if (message.populace !== 0) {
      writer.uint32(24).uint32(message.populace);
    }
    if (message.direction !== 0) {
      writer.uint32(32).int32(message.direction);
    }
    if (message.population !== 0) {
      writer.uint32(40).uint32(message.population);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMove {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgMove } as MsgMove;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.gameId = reader.uint64() as Long;
          break;
        case 3:
          message.populace = reader.uint32();
          break;
        case 4:
          message.direction = reader.int32() as any;
          break;
        case 5:
          message.population = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgMove {
    const message = { ...baseMsgMove } as MsgMove;
    message.creator =
      object.creator !== undefined && object.creator !== null
        ? String(object.creator)
        : "";
    message.gameId =
      object.gameId !== undefined && object.gameId !== null
        ? Long.fromString(object.gameId)
        : Long.UZERO;
    message.populace =
      object.populace !== undefined && object.populace !== null
        ? Number(object.populace)
        : 0;
    message.direction =
      object.direction !== undefined && object.direction !== null
        ? directionFromJSON(object.direction)
        : 0;
    message.population =
      object.population !== undefined && object.population !== null
        ? Number(object.population)
        : 0;
    return message;
  },

  toJSON(message: MsgMove): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.gameId !== undefined &&
      (obj.gameId = (message.gameId || Long.UZERO).toString());
    message.populace !== undefined && (obj.populace = message.populace);
    message.direction !== undefined &&
      (obj.direction = directionToJSON(message.direction));
    message.population !== undefined && (obj.population = message.population);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgMove>): MsgMove {
    const message = { ...baseMsgMove } as MsgMove;
    message.creator = object.creator ?? "";
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId as Long;
    } else {
      message.gameId = Long.UZERO;
    }
    message.populace = object.populace ?? 0;
    message.direction = object.direction ?? 0;
    message.population = object.population ?? 0;
    return message;
  },
};

const baseMsgMoveResponse: object = {};

export const MsgMoveResponse = {
  encode(
    _: MsgMoveResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgMoveResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgMoveResponse {
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse;
    return message;
  },

  toJSON(_: MsgMoveResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgMoveResponse>): MsgMoveResponse {
    const message = { ...baseMsgMoveResponse } as MsgMoveResponse;
    return message;
  },
};

const baseMsgBuild: object = {
  creator: "",
  gameId: Long.UZERO,
  populace: 0,
  settlement: 0,
};

export const MsgBuild = {
  encode(
    message: MsgBuild,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (!message.gameId.isZero()) {
      writer.uint32(16).uint64(message.gameId);
    }
    if (message.populace !== 0) {
      writer.uint32(24).uint32(message.populace);
    }
    if (message.settlement !== 0) {
      writer.uint32(32).int32(message.settlement);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBuild {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBuild } as MsgBuild;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.gameId = reader.uint64() as Long;
          break;
        case 3:
          message.populace = reader.uint32();
          break;
        case 4:
          message.settlement = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgBuild {
    const message = { ...baseMsgBuild } as MsgBuild;
    message.creator =
      object.creator !== undefined && object.creator !== null
        ? String(object.creator)
        : "";
    message.gameId =
      object.gameId !== undefined && object.gameId !== null
        ? Long.fromString(object.gameId)
        : Long.UZERO;
    message.populace =
      object.populace !== undefined && object.populace !== null
        ? Number(object.populace)
        : 0;
    message.settlement =
      object.settlement !== undefined && object.settlement !== null
        ? settlementFromJSON(object.settlement)
        : 0;
    return message;
  },

  toJSON(message: MsgBuild): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.gameId !== undefined &&
      (obj.gameId = (message.gameId || Long.UZERO).toString());
    message.populace !== undefined && (obj.populace = message.populace);
    message.settlement !== undefined &&
      (obj.settlement = settlementToJSON(message.settlement));
    return obj;
  },

  fromPartial(object: DeepPartial<MsgBuild>): MsgBuild {
    const message = { ...baseMsgBuild } as MsgBuild;
    message.creator = object.creator ?? "";
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId as Long;
    } else {
      message.gameId = Long.UZERO;
    }
    message.populace = object.populace ?? 0;
    message.settlement = object.settlement ?? 0;
    return message;
  },
};

const baseMsgBuildResponse: object = {};

export const MsgBuildResponse = {
  encode(
    _: MsgBuildResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBuildResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgBuildResponse {
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse;
    return message;
  },

  toJSON(_: MsgBuildResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgBuildResponse>): MsgBuildResponse {
    const message = { ...baseMsgBuildResponse } as MsgBuildResponse;
    return message;
  },
};

const baseMsgCreate: object = { players: "" };

export const MsgCreate = {
  encode(
    message: MsgCreate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.players) {
      writer.uint32(10).string(v!);
    }
    if (message.config !== undefined) {
      Config.encode(message.config, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreate } as MsgCreate;
    message.players = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.players.push(reader.string());
          break;
        case 2:
          message.config = Config.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreate {
    const message = { ...baseMsgCreate } as MsgCreate;
    message.players = (object.players ?? []).map((e: any) => String(e));
    message.config =
      object.config !== undefined && object.config !== null
        ? Config.fromJSON(object.config)
        : undefined;
    return message;
  },

  toJSON(message: MsgCreate): unknown {
    const obj: any = {};
    if (message.players) {
      obj.players = message.players.map((e) => e);
    } else {
      obj.players = [];
    }
    message.config !== undefined &&
      (obj.config = message.config ? Config.toJSON(message.config) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreate>): MsgCreate {
    const message = { ...baseMsgCreate } as MsgCreate;
    message.players = (object.players ?? []).map((e) => e);
    message.config =
      object.config !== undefined && object.config !== null
        ? Config.fromPartial(object.config)
        : undefined;
    return message;
  },
};

const baseMsgCreateResponse: object = { gameId: Long.UZERO };

export const MsgCreateResponse = {
  encode(
    message: MsgCreateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.gameId.isZero()) {
      writer.uint32(8).uint64(message.gameId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgCreateResponse } as MsgCreateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.gameId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateResponse {
    const message = { ...baseMsgCreateResponse } as MsgCreateResponse;
    message.gameId =
      object.gameId !== undefined && object.gameId !== null
        ? Long.fromString(object.gameId)
        : Long.UZERO;
    return message;
  },

  toJSON(message: MsgCreateResponse): unknown {
    const obj: any = {};
    message.gameId !== undefined &&
      (obj.gameId = (message.gameId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgCreateResponse>): MsgCreateResponse {
    const message = { ...baseMsgCreateResponse } as MsgCreateResponse;
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId as Long;
    } else {
      message.gameId = Long.UZERO;
    }
    return message;
  },
};

const baseMsgChangeParams: object = { authority: "" };

export const MsgChangeParams = {
  encode(
    message: MsgChangeParams,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgChangeParams {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgChangeParams } as MsgChangeParams;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgChangeParams {
    const message = { ...baseMsgChangeParams } as MsgChangeParams;
    message.authority =
      object.authority !== undefined && object.authority !== null
        ? String(object.authority)
        : "";
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromJSON(object.params)
        : undefined;
    return message;
  },

  toJSON(message: MsgChangeParams): unknown {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgChangeParams>): MsgChangeParams {
    const message = { ...baseMsgChangeParams } as MsgChangeParams;
    message.authority = object.authority ?? "";
    message.params =
      object.params !== undefined && object.params !== null
        ? Params.fromPartial(object.params)
        : undefined;
    return message;
  },
};

const baseMsgChangeParamsResponse: object = { version: 0 };

export const MsgChangeParamsResponse = {
  encode(
    message: MsgChangeParamsResponse,
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
  ): MsgChangeParamsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMsgChangeParamsResponse,
    } as MsgChangeParamsResponse;
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

  fromJSON(object: any): MsgChangeParamsResponse {
    const message = {
      ...baseMsgChangeParamsResponse,
    } as MsgChangeParamsResponse;
    message.version =
      object.version !== undefined && object.version !== null
        ? Number(object.version)
        : 0;
    return message;
  },

  toJSON(message: MsgChangeParamsResponse): unknown {
    const obj: any = {};
    message.version !== undefined && (obj.version = message.version);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MsgChangeParamsResponse>
  ): MsgChangeParamsResponse {
    const message = {
      ...baseMsgChangeParamsResponse,
    } as MsgChangeParamsResponse;
    message.version = object.version ?? 0;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  Move(request: MsgMove): Promise<MsgMoveResponse>;
  Build(request: MsgBuild): Promise<MsgBuildResponse>;
  Create(request: MsgCreate): Promise<MsgCreateResponse>;
  ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Move = this.Move.bind(this);
    this.Build = this.Build.bind(this);
    this.Create = this.Create.bind(this);
    this.ChangeParams = this.ChangeParams.bind(this);
  }
  Move(request: MsgMove): Promise<MsgMoveResponse> {
    const data = MsgMove.encode(request).finish();
    const promise = this.rpc.request("rook.game.Msg", "Move", data);
    return promise.then((data) => MsgMoveResponse.decode(new _m0.Reader(data)));
  }

  Build(request: MsgBuild): Promise<MsgBuildResponse> {
    const data = MsgBuild.encode(request).finish();
    const promise = this.rpc.request("rook.game.Msg", "Build", data);
    return promise.then((data) =>
      MsgBuildResponse.decode(new _m0.Reader(data))
    );
  }

  Create(request: MsgCreate): Promise<MsgCreateResponse> {
    const data = MsgCreate.encode(request).finish();
    const promise = this.rpc.request("rook.game.Msg", "Create", data);
    return promise.then((data) =>
      MsgCreateResponse.decode(new _m0.Reader(data))
    );
  }

  ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse> {
    const data = MsgChangeParams.encode(request).finish();
    const promise = this.rpc.request("rook.game.Msg", "ChangeParams", data);
    return promise.then((data) =>
      MsgChangeParamsResponse.decode(new _m0.Reader(data))
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
