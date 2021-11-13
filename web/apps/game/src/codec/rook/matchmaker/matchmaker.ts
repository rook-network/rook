/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Config } from "../../rook/game/config";
import { Duration } from "../../google/protobuf/duration";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "rook.matchmaker";

export interface Room {
  /** Add a custom config */
  config?: Config | undefined;
  /** Or you can use a predefined mode */
  modeId: number | undefined;
  /** the current players in the room */
  players: string[];
  /** pending invitations for players that can join (like a whitelist) */
  pending: string[];
  /** anyone can join */
  public: boolean;
  /** the minimum amount of players needed to start a game */
  quorum: number;
  /** the max amount of players that can join the room */
  capacity: number;
  /** when the room was created. Rooms get garbage collected after a while */
  created?: Date | undefined;
  /**
   * when quorum is reached and we are locked in to starting the game.
   * The prestart_wait_period gives a bufer for more people to join if they
   * want.
   */
  ready?: Date | undefined;
  /**
   * the time that the game is scheduled to start. Participants have until
   * then to join. The game only starts if the quorum is met. This is good
   * for tournament games
   */
  scheduled?: Date | undefined;
}

/** IndexedRoom pins an id to the room */
export interface IndexedRoom {
  roomId: Long;
  room?: Room;
}

/**
 * Modes are a way of accumulating a small set of possible games that people can
 * choose between
 */
export interface Mode {
  /** the config to be used for the game */
  config?: Config;
  /** the minimum amount of players needed to start a game */
  quorum: number;
  /** the max amount of players that can join the room */
  capacity: number;
}

/** IndexedMode pins an id to the mode */
export interface IndexedMode {
  modeId: number;
  mode?: Mode;
  gameId: Long;
}

export interface Params {
  /**
   * the maximum duration a room can last for before it is closed and all
   * players are kicked
   */
  roomLifespan?: Duration;
  /**
   * the period betwee a quorum of players readying up and the start of the
   * game. This allows a few more players to join
   */
  prestartWaitPeriod?: Duration;
}

const baseRoom: object = {
  players: "",
  pending: "",
  public: false,
  quorum: 0,
  capacity: 0,
};

export const Room = {
  encode(message: Room, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.config !== undefined) {
      Config.encode(message.config, writer.uint32(10).fork()).ldelim();
    }
    if (message.modeId !== undefined) {
      writer.uint32(16).uint32(message.modeId);
    }
    for (const v of message.players) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.pending) {
      writer.uint32(34).string(v!);
    }
    if (message.public === true) {
      writer.uint32(40).bool(message.public);
    }
    if (message.quorum !== 0) {
      writer.uint32(48).uint32(message.quorum);
    }
    if (message.capacity !== 0) {
      writer.uint32(56).uint32(message.capacity);
    }
    if (message.created !== undefined) {
      Timestamp.encode(
        toTimestamp(message.created),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.ready !== undefined) {
      Timestamp.encode(
        toTimestamp(message.ready),
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.scheduled !== undefined) {
      Timestamp.encode(
        toTimestamp(message.scheduled),
        writer.uint32(82).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Room {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRoom } as Room;
    message.players = [];
    message.pending = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.config = Config.decode(reader, reader.uint32());
          break;
        case 2:
          message.modeId = reader.uint32();
          break;
        case 3:
          message.players.push(reader.string());
          break;
        case 4:
          message.pending.push(reader.string());
          break;
        case 5:
          message.public = reader.bool();
          break;
        case 6:
          message.quorum = reader.uint32();
          break;
        case 7:
          message.capacity = reader.uint32();
          break;
        case 8:
          message.created = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.ready = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 10:
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

  fromJSON(object: any): Room {
    const message = { ...baseRoom } as Room;
    message.players = [];
    message.pending = [];
    if (object.config !== undefined && object.config !== null) {
      message.config = Config.fromJSON(object.config);
    } else {
      message.config = undefined;
    }
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = Number(object.modeId);
    } else {
      message.modeId = undefined;
    }
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(String(e));
      }
    }
    if (object.pending !== undefined && object.pending !== null) {
      for (const e of object.pending) {
        message.pending.push(String(e));
      }
    }
    if (object.public !== undefined && object.public !== null) {
      message.public = Boolean(object.public);
    } else {
      message.public = false;
    }
    if (object.quorum !== undefined && object.quorum !== null) {
      message.quorum = Number(object.quorum);
    } else {
      message.quorum = 0;
    }
    if (object.capacity !== undefined && object.capacity !== null) {
      message.capacity = Number(object.capacity);
    } else {
      message.capacity = 0;
    }
    if (object.created !== undefined && object.created !== null) {
      message.created = fromJsonTimestamp(object.created);
    } else {
      message.created = undefined;
    }
    if (object.ready !== undefined && object.ready !== null) {
      message.ready = fromJsonTimestamp(object.ready);
    } else {
      message.ready = undefined;
    }
    if (object.scheduled !== undefined && object.scheduled !== null) {
      message.scheduled = fromJsonTimestamp(object.scheduled);
    } else {
      message.scheduled = undefined;
    }
    return message;
  },

  toJSON(message: Room): unknown {
    const obj: any = {};
    message.config !== undefined &&
      (obj.config = message.config ? Config.toJSON(message.config) : undefined);
    message.modeId !== undefined && (obj.modeId = message.modeId);
    if (message.players) {
      obj.players = message.players.map((e) => e);
    } else {
      obj.players = [];
    }
    if (message.pending) {
      obj.pending = message.pending.map((e) => e);
    } else {
      obj.pending = [];
    }
    message.public !== undefined && (obj.public = message.public);
    message.quorum !== undefined && (obj.quorum = message.quorum);
    message.capacity !== undefined && (obj.capacity = message.capacity);
    message.created !== undefined &&
      (obj.created = message.created.toISOString());
    message.ready !== undefined && (obj.ready = message.ready.toISOString());
    message.scheduled !== undefined &&
      (obj.scheduled = message.scheduled.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<Room>): Room {
    const message = { ...baseRoom } as Room;
    message.players = [];
    message.pending = [];
    if (object.config !== undefined && object.config !== null) {
      message.config = Config.fromPartial(object.config);
    } else {
      message.config = undefined;
    }
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = object.modeId;
    } else {
      message.modeId = undefined;
    }
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(e);
      }
    }
    if (object.pending !== undefined && object.pending !== null) {
      for (const e of object.pending) {
        message.pending.push(e);
      }
    }
    if (object.public !== undefined && object.public !== null) {
      message.public = object.public;
    } else {
      message.public = false;
    }
    if (object.quorum !== undefined && object.quorum !== null) {
      message.quorum = object.quorum;
    } else {
      message.quorum = 0;
    }
    if (object.capacity !== undefined && object.capacity !== null) {
      message.capacity = object.capacity;
    } else {
      message.capacity = 0;
    }
    if (object.created !== undefined && object.created !== null) {
      message.created = object.created;
    } else {
      message.created = undefined;
    }
    if (object.ready !== undefined && object.ready !== null) {
      message.ready = object.ready;
    } else {
      message.ready = undefined;
    }
    if (object.scheduled !== undefined && object.scheduled !== null) {
      message.scheduled = object.scheduled;
    } else {
      message.scheduled = undefined;
    }
    return message;
  },
};

const baseIndexedRoom: object = { roomId: Long.UZERO };

export const IndexedRoom = {
  encode(
    message: IndexedRoom,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.roomId.isZero()) {
      writer.uint32(8).uint64(message.roomId);
    }
    if (message.room !== undefined) {
      Room.encode(message.room, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IndexedRoom {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseIndexedRoom } as IndexedRoom;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.uint64() as Long;
          break;
        case 2:
          message.room = Room.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IndexedRoom {
    const message = { ...baseIndexedRoom } as IndexedRoom;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = Long.fromString(object.roomId);
    } else {
      message.roomId = Long.UZERO;
    }
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromJSON(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },

  toJSON(message: IndexedRoom): unknown {
    const obj: any = {};
    message.roomId !== undefined &&
      (obj.roomId = (message.roomId || Long.UZERO).toString());
    message.room !== undefined &&
      (obj.room = message.room ? Room.toJSON(message.room) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<IndexedRoom>): IndexedRoom {
    const message = { ...baseIndexedRoom } as IndexedRoom;
    if (object.roomId !== undefined && object.roomId !== null) {
      message.roomId = object.roomId as Long;
    } else {
      message.roomId = Long.UZERO;
    }
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromPartial(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },
};

const baseMode: object = { quorum: 0, capacity: 0 };

export const Mode = {
  encode(message: Mode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.config !== undefined) {
      Config.encode(message.config, writer.uint32(10).fork()).ldelim();
    }
    if (message.quorum !== 0) {
      writer.uint32(16).uint32(message.quorum);
    }
    if (message.capacity !== 0) {
      writer.uint32(24).uint32(message.capacity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Mode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMode } as Mode;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.config = Config.decode(reader, reader.uint32());
          break;
        case 2:
          message.quorum = reader.uint32();
          break;
        case 3:
          message.capacity = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Mode {
    const message = { ...baseMode } as Mode;
    if (object.config !== undefined && object.config !== null) {
      message.config = Config.fromJSON(object.config);
    } else {
      message.config = undefined;
    }
    if (object.quorum !== undefined && object.quorum !== null) {
      message.quorum = Number(object.quorum);
    } else {
      message.quorum = 0;
    }
    if (object.capacity !== undefined && object.capacity !== null) {
      message.capacity = Number(object.capacity);
    } else {
      message.capacity = 0;
    }
    return message;
  },

  toJSON(message: Mode): unknown {
    const obj: any = {};
    message.config !== undefined &&
      (obj.config = message.config ? Config.toJSON(message.config) : undefined);
    message.quorum !== undefined && (obj.quorum = message.quorum);
    message.capacity !== undefined && (obj.capacity = message.capacity);
    return obj;
  },

  fromPartial(object: DeepPartial<Mode>): Mode {
    const message = { ...baseMode } as Mode;
    if (object.config !== undefined && object.config !== null) {
      message.config = Config.fromPartial(object.config);
    } else {
      message.config = undefined;
    }
    if (object.quorum !== undefined && object.quorum !== null) {
      message.quorum = object.quorum;
    } else {
      message.quorum = 0;
    }
    if (object.capacity !== undefined && object.capacity !== null) {
      message.capacity = object.capacity;
    } else {
      message.capacity = 0;
    }
    return message;
  },
};

const baseIndexedMode: object = { modeId: 0, gameId: Long.UZERO };

export const IndexedMode = {
  encode(
    message: IndexedMode,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.modeId !== 0) {
      writer.uint32(8).uint32(message.modeId);
    }
    if (message.mode !== undefined) {
      Mode.encode(message.mode, writer.uint32(18).fork()).ldelim();
    }
    if (!message.gameId.isZero()) {
      writer.uint32(24).uint64(message.gameId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IndexedMode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseIndexedMode } as IndexedMode;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modeId = reader.uint32();
          break;
        case 2:
          message.mode = Mode.decode(reader, reader.uint32());
          break;
        case 3:
          message.gameId = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IndexedMode {
    const message = { ...baseIndexedMode } as IndexedMode;
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = Number(object.modeId);
    } else {
      message.modeId = 0;
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromJSON(object.mode);
    } else {
      message.mode = undefined;
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = Long.fromString(object.gameId);
    } else {
      message.gameId = Long.UZERO;
    }
    return message;
  },

  toJSON(message: IndexedMode): unknown {
    const obj: any = {};
    message.modeId !== undefined && (obj.modeId = message.modeId);
    message.mode !== undefined &&
      (obj.mode = message.mode ? Mode.toJSON(message.mode) : undefined);
    message.gameId !== undefined &&
      (obj.gameId = (message.gameId || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<IndexedMode>): IndexedMode {
    const message = { ...baseIndexedMode } as IndexedMode;
    if (object.modeId !== undefined && object.modeId !== null) {
      message.modeId = object.modeId;
    } else {
      message.modeId = 0;
    }
    if (object.mode !== undefined && object.mode !== null) {
      message.mode = Mode.fromPartial(object.mode);
    } else {
      message.mode = undefined;
    }
    if (object.gameId !== undefined && object.gameId !== null) {
      message.gameId = object.gameId as Long;
    } else {
      message.gameId = Long.UZERO;
    }
    return message;
  },
};

const baseParams: object = {};

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.roomLifespan !== undefined) {
      Duration.encode(message.roomLifespan, writer.uint32(10).fork()).ldelim();
    }
    if (message.prestartWaitPeriod !== undefined) {
      Duration.encode(
        message.prestartWaitPeriod,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseParams } as Params;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomLifespan = Duration.decode(reader, reader.uint32());
          break;
        case 2:
          message.prestartWaitPeriod = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    const message = { ...baseParams } as Params;
    if (object.roomLifespan !== undefined && object.roomLifespan !== null) {
      message.roomLifespan = Duration.fromJSON(object.roomLifespan);
    } else {
      message.roomLifespan = undefined;
    }
    if (
      object.prestartWaitPeriod !== undefined &&
      object.prestartWaitPeriod !== null
    ) {
      message.prestartWaitPeriod = Duration.fromJSON(object.prestartWaitPeriod);
    } else {
      message.prestartWaitPeriod = undefined;
    }
    return message;
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.roomLifespan !== undefined &&
      (obj.roomLifespan = message.roomLifespan
        ? Duration.toJSON(message.roomLifespan)
        : undefined);
    message.prestartWaitPeriod !== undefined &&
      (obj.prestartWaitPeriod = message.prestartWaitPeriod
        ? Duration.toJSON(message.prestartWaitPeriod)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params;
    if (object.roomLifespan !== undefined && object.roomLifespan !== null) {
      message.roomLifespan = Duration.fromPartial(object.roomLifespan);
    } else {
      message.roomLifespan = undefined;
    }
    if (
      object.prestartWaitPeriod !== undefined &&
      object.prestartWaitPeriod !== null
    ) {
      message.prestartWaitPeriod = Duration.fromPartial(
        object.prestartWaitPeriod
      );
    } else {
      message.prestartWaitPeriod = undefined;
    }
    return message;
  },
};

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
