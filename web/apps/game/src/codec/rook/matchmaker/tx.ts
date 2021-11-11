/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Mode } from "../../rook/matchmaker/matchmaker";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "rook.matchmaker";

export interface MsgHost {
  /** The host of the room */
  host: string;
  /** Mode defines the game config, the quorum and capacity of players */
  mode?: Mode | undefined;
  /** Or you can use a predefined mode */
  modeId: number | undefined;
  /** the list of players that are invited to join the room */
  invitees: string[];
  /** public defines whether the room is open for all players to join */
  public: boolean;
  /**
   * For scheduled games (like tournaments). Participants have until
   * then to join. The game only starts if the quorum is met.
   */
  scheduled?: Date;
}

export interface MsgHostResponse {
  roomId: Long;
}

export interface MsgJoin {
  player: string;
  roomId: Long;
}

export interface MsgJoinResponse {}

export interface MsgFind {
  player: string;
  mode: number;
}

export interface MsgFindResponse {
  roomId: Long;
}

export interface MsgLeave {
  player: string;
  roomId: Long;
}

export interface MsgLeaveResponse {}

export interface MsgAddMode {
  authority: string;
  mode?: Mode;
}

export interface MsgAddModeResponse {
  modeId: number;
}

export interface MsgRemoveMode {
  authority: string;
  id: number;
}

export interface MsgRemoveModeResponse {}

const baseMsgHost: object = { host: "", invitees: "", public: false };

export const MsgHost = {
  encode(
    message: MsgHost,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.host !== "") {
      writer.uint32(10).string(message.host);
    }
    if (message.mode !== undefined) {
      Mode.encode(message.mode, writer.uint32(18).fork()).ldelim();
    }
    if (message.modeId !== undefined) {
      writer.uint32(24).uint32(message.modeId);
    }
    for (const v of message.invitees) {
      writer.uint32(34).string(v!);
    }
    if (message.public === true) {
      writer.uint32(40).bool(message.public);
    }
    if (message.scheduled !== undefined) {
      Timestamp.encode(
        toTimestamp(message.scheduled),
        writer.uint32(50).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgHost {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgHost } as MsgHost;
    message.invitees = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.host = reader.string();
          break;
        case 2:
          message.mode = Mode.decode(reader, reader.uint32());
          break;
        case 3:
          message.modeId = reader.uint32();
          break;
        case 4:
          message.invitees.push(reader.string());
          break;
        case 5:
          message.public = reader.bool();
          break;
        case 6:
          message.scheduled = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgHost {
    const message = { ...baseMsgHost } as MsgHost;
    message.invitees = [];
    if (object.host !== undefined && object.host !== null) {
      message.host = String(object.host);
    } else {
      message.host = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromJSON(object.mode);
    } else {
      message.mode = undefined;
    }
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = Number(object.modeId);
    } else {
      message.modeId = undefined;
    }
    if (object.invitees !== undefined && object.invitees !== null) {
      for (const e of object.invitees) {
        message.invitees.push(String(e));
      }
    }
    if (object.public !== undefined && object.public !== null) {
      message.public = Boolean(object.public);
    } else {
      message.public = false;
    }
    if (object.scheduled !== undefined && object.scheduled !== null) {
      message.scheduled = fromJsonTimestamp(object.scheduled);
    } else {
      message.scheduled = undefined;
    }
    return message;
  },

  toJSON(message: MsgHost): unknown {
    const obj: any = {};
    message.host !== undefined && (obj.host = message.host);
    message.mode !== undefined &&
      (obj.mode = message.mode ? Mode.toJSON(message.mode) : undefined);
    message.modeId !== undefined && (obj.modeId = message.modeId);
    if (message.invitees) {
      obj.invitees = message.invitees.map((e) => e);
    } else {
      obj.invitees = [];
    }
    message.public !== undefined && (obj.public = message.public);
    message.scheduled !== undefined &&
      (obj.scheduled = message.scheduled.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgHost>): MsgHost {
    const message = { ...baseMsgHost } as MsgHost;
    message.invitees = [];
    if (object.host !== undefined && object.host !== null) {
      message.host = object.host;
    } else {
      message.host = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromPartial(object.mode);
    } else {
      message.mode = undefined;
    }
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = object.modeId;
    } else {
      message.modeId = undefined;
    }
    if (object.invitees !== undefined && object.invitees !== null) {
      for (const e of object.invitees) {
        message.invitees.push(e);
      }
    }
    if (object.public !== undefined && object.public !== null) {
      message.public = object.public;
    } else {
      message.public = false;
    }
    if (object.scheduled !== undefined && object.scheduled !== null) {
      message.scheduled = object.scheduled;
    } else {
      message.scheduled = undefined;
    }
    return message;
  },
};

const baseMsgHostResponse: object = { roomId: Long.UZERO };

export const MsgHostResponse = {
  encode(
    message: MsgHostResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.roomId.isZero()) {
      writer.uint32(8).uint64(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgHostResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgHostResponse } as MsgHostResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgHostResponse {
    const message = { ...baseMsgHostResponse } as MsgHostResponse;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = Long.fromString(object.roomId);
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },

  toJSON(message: MsgHostResponse): unknown {
    const obj: any = {};
    message.roomId !== undefined &&
      (obj.roomId = (message.roomId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgHostResponse>): MsgHostResponse {
    const message = { ...baseMsgHostResponse } as MsgHostResponse;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = object.roomId as Long;
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },
};

const baseMsgJoin: object = { player: "", roomId: Long.UZERO };

export const MsgJoin = {
  encode(
    message: MsgJoin,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.player !== "") {
      writer.uint32(10).string(message.player);
    }
    if (!message.roomId.isZero()) {
      writer.uint32(16).uint64(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoin {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgJoin } as MsgJoin;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string();
          break;
        case 2:
          message.roomId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgJoin {
    const message = { ...baseMsgJoin } as MsgJoin;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = Long.fromString(object.roomId);
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },

  toJSON(message: MsgJoin): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    message.roomId !== undefined &&
      (obj.roomId = (message.roomId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgJoin>): MsgJoin {
    const message = { ...baseMsgJoin } as MsgJoin;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = object.roomId as Long;
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },
};

const baseMsgJoinResponse: object = {};

export const MsgJoinResponse = {
  encode(
    _: MsgJoinResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgJoinResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgJoinResponse } as MsgJoinResponse;
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

  fromJSON(_: any): MsgJoinResponse {
    const message = { ...baseMsgJoinResponse } as MsgJoinResponse;
    return message;
  },

  toJSON(_: MsgJoinResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgJoinResponse>): MsgJoinResponse {
    const message = { ...baseMsgJoinResponse } as MsgJoinResponse;
    return message;
  },
};

const baseMsgFind: object = { player: "", mode: 0 };

export const MsgFind = {
  encode(
    message: MsgFind,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.player !== "") {
      writer.uint32(10).string(message.player);
    }
    if (message.mode !== 0) {
      writer.uint32(16).uint32(message.mode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgFind {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgFind } as MsgFind;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string();
          break;
        case 2:
          message.mode = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgFind {
    const message = { ...baseMsgFind } as MsgFind;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Number(object.mode);
    } else {
      message.mode = 0;
    }
    return message;
  },

  toJSON(message: MsgFind): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    message.mode !== undefined && (obj.mode = message.mode);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgFind>): MsgFind {
    const message = { ...baseMsgFind } as MsgFind;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = object.mode;
    } else {
      message.mode = 0;
    }
    return message;
  },
};

const baseMsgFindResponse: object = { roomId: Long.UZERO };

export const MsgFindResponse = {
  encode(
    message: MsgFindResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.roomId.isZero()) {
      writer.uint32(8).uint64(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgFindResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgFindResponse } as MsgFindResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgFindResponse {
    const message = { ...baseMsgFindResponse } as MsgFindResponse;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = Long.fromString(object.roomId);
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },

  toJSON(message: MsgFindResponse): unknown {
    const obj: any = {};
    message.roomId !== undefined &&
      (obj.roomId = (message.roomId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgFindResponse>): MsgFindResponse {
    const message = { ...baseMsgFindResponse } as MsgFindResponse;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = object.roomId as Long;
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },
};

const baseMsgLeave: object = { player: "", roomId: Long.UZERO };

export const MsgLeave = {
  encode(
    message: MsgLeave,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.player !== "") {
      writer.uint32(10).string(message.player);
    }
    if (!message.roomId.isZero()) {
      writer.uint32(16).uint64(message.roomId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgLeave {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgLeave } as MsgLeave;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.player = reader.string();
          break;
        case 2:
          message.roomId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgLeave {
    const message = { ...baseMsgLeave } as MsgLeave;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = Long.fromString(object.roomId);
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },

  toJSON(message: MsgLeave): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    message.roomId !== undefined &&
      (obj.roomId = (message.roomId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<MsgLeave>): MsgLeave {
    const message = { ...baseMsgLeave } as MsgLeave;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = object.roomId as Long;
    } else {
      message.roomId = Long.UZERO;
    }
    return message;
  },
};

const baseMsgLeaveResponse: object = {};

export const MsgLeaveResponse = {
  encode(
    _: MsgLeaveResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgLeaveResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgLeaveResponse } as MsgLeaveResponse;
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

  fromJSON(_: any): MsgLeaveResponse {
    const message = { ...baseMsgLeaveResponse } as MsgLeaveResponse;
    return message;
  },

  toJSON(_: MsgLeaveResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgLeaveResponse>): MsgLeaveResponse {
    const message = { ...baseMsgLeaveResponse } as MsgLeaveResponse;
    return message;
  },
};

const baseMsgAddMode: object = { authority: "" };

export const MsgAddMode = {
  encode(
    message: MsgAddMode,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.mode !== undefined) {
      Mode.encode(message.mode, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddMode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAddMode } as MsgAddMode;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.mode = Mode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAddMode {
    const message = { ...baseMsgAddMode } as MsgAddMode;
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = String(object.authority);
    } else {
      message.authority = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromJSON(object.mode);
    } else {
      message.mode = undefined;
    }
    return message;
  },

  toJSON(message: MsgAddMode): unknown {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.mode !== undefined &&
      (obj.mode = message.mode ? Mode.toJSON(message.mode) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgAddMode>): MsgAddMode {
    const message = { ...baseMsgAddMode } as MsgAddMode;
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    } else {
      message.authority = "";
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromPartial(object.mode);
    } else {
      message.mode = undefined;
    }
    return message;
  },
};

const baseMsgAddModeResponse: object = { modeId: 0 };

export const MsgAddModeResponse = {
  encode(
    message: MsgAddModeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.modeId !== 0) {
      writer.uint32(8).uint32(message.modeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddModeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgAddModeResponse } as MsgAddModeResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modeId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAddModeResponse {
    const message = { ...baseMsgAddModeResponse } as MsgAddModeResponse;
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = Number(object.modeId);
    } else {
      message.modeId = 0;
    }
    return message;
  },

  toJSON(message: MsgAddModeResponse): unknown {
    const obj: any = {};
    message.modeId !== undefined && (obj.modeId = message.modeId);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgAddModeResponse>): MsgAddModeResponse {
    const message = { ...baseMsgAddModeResponse } as MsgAddModeResponse;
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = object.modeId;
    } else {
      message.modeId = 0;
    }
    return message;
  },
};

const baseMsgRemoveMode: object = { authority: "", id: 0 };

export const MsgRemoveMode = {
  encode(
    message: MsgRemoveMode,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.id !== 0) {
      writer.uint32(16).uint32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveMode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRemoveMode } as MsgRemoveMode;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authority = reader.string();
          break;
        case 2:
          message.id = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRemoveMode {
    const message = { ...baseMsgRemoveMode } as MsgRemoveMode;
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = String(object.authority);
    } else {
      message.authority = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = Number(object.id);
    } else {
      message.id = 0;
    }
    return message;
  },

  toJSON(message: MsgRemoveMode): unknown {
    const obj: any = {};
    message.authority !== undefined && (obj.authority = message.authority);
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgRemoveMode>): MsgRemoveMode {
    const message = { ...baseMsgRemoveMode } as MsgRemoveMode;
    if (object.authority !== undefined && object.authority !== null) {
      message.authority = object.authority;
    } else {
      message.authority = "";
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = 0;
    }
    return message;
  },
};

const baseMsgRemoveModeResponse: object = {};

export const MsgRemoveModeResponse = {
  encode(
    _: MsgRemoveModeResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgRemoveModeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgRemoveModeResponse } as MsgRemoveModeResponse;
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

  fromJSON(_: any): MsgRemoveModeResponse {
    const message = { ...baseMsgRemoveModeResponse } as MsgRemoveModeResponse;
    return message;
  },

  toJSON(_: MsgRemoveModeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<MsgRemoveModeResponse>): MsgRemoveModeResponse {
    const message = { ...baseMsgRemoveModeResponse } as MsgRemoveModeResponse;
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** Host creates a room for a custom game */
  Host(request: MsgHost): Promise<MsgHostResponse>;
  /** Join adds a player to a room */
  Join(request: MsgJoin): Promise<MsgJoinResponse>;
  /** Find adds a player to a room based of a mode */
  Find(request: MsgFind): Promise<MsgFindResponse>;
  /** Leave removes a player from the room they are in. */
  Leave(request: MsgLeave): Promise<MsgLeaveResponse>;
  /** AddMode adds a new mode */
  AddMode(request: MsgAddMode): Promise<MsgAddModeResponse>;
  /** RemoveMode removes an existing mode */
  RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Host = this.Host.bind(this);
    this.Join = this.Join.bind(this);
    this.Find = this.Find.bind(this);
    this.Leave = this.Leave.bind(this);
    this.AddMode = this.AddMode.bind(this);
    this.RemoveMode = this.RemoveMode.bind(this);
  }
  Host(request: MsgHost): Promise<MsgHostResponse> {
    const data = MsgHost.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "Host", data);
    return promise.then((data) => MsgHostResponse.decode(new _m0.Reader(data)));
  }

  Join(request: MsgJoin): Promise<MsgJoinResponse> {
    const data = MsgJoin.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "Join", data);
    return promise.then((data) => MsgJoinResponse.decode(new _m0.Reader(data)));
  }

  Find(request: MsgFind): Promise<MsgFindResponse> {
    const data = MsgFind.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "Find", data);
    return promise.then((data) => MsgFindResponse.decode(new _m0.Reader(data)));
  }

  Leave(request: MsgLeave): Promise<MsgLeaveResponse> {
    const data = MsgLeave.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "Leave", data);
    return promise.then((data) =>
      MsgLeaveResponse.decode(new _m0.Reader(data))
    );
  }

  AddMode(request: MsgAddMode): Promise<MsgAddModeResponse> {
    const data = MsgAddMode.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "AddMode", data);
    return promise.then((data) =>
      MsgAddModeResponse.decode(new _m0.Reader(data))
    );
  }

  RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse> {
    const data = MsgRemoveMode.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Msg", "RemoveMode", data);
    return promise.then((data) =>
      MsgRemoveModeResponse.decode(new _m0.Reader(data))
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

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds.toNumber() * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
