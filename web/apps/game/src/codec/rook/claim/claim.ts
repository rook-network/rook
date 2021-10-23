/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../google/protobuf/duration";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "rook.claim";

export enum Action {
  /** ActionActivate - Activate action must be completed before all others */
  ActionActivate = 0,
  ActionPlay = 1,
  ActionWin = 2,
  ActionDelegate = 3,
  ActionTrade = 4,
  UNRECOGNIZED = -1,
}

export function actionFromJSON(object: any): Action {
  switch (object) {
    case 0:
    case "ActionActivate":
      return Action.ActionActivate;
    case 1:
    case "ActionPlay":
      return Action.ActionPlay;
    case 2:
    case "ActionWin":
      return Action.ActionWin;
    case 3:
    case "ActionDelegate":
      return Action.ActionDelegate;
    case 4:
    case "ActionTrade":
      return Action.ActionTrade;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Action.UNRECOGNIZED;
  }
}

export function actionToJSON(object: Action): string {
  switch (object) {
    case Action.ActionActivate:
      return "ActionActivate";
    case Action.ActionPlay:
      return "ActionPlay";
    case Action.ActionWin:
      return "ActionWin";
    case Action.ActionDelegate:
      return "ActionDelegate";
    case Action.ActionTrade:
      return "ActionTrade";
    default:
      return "UNKNOWN";
  }
}

/** A Claim Records is the metadata of claim data per address */
export interface ClaimRecord {
  /** address of claim user */
  address: string;
  /** total initial claimable amount for the user */
  initialClaimableAmount: Long;
  /**
   * true if action is completed
   * index of bool in array refers to action enum #
   */
  actionCompleted: boolean[];
}

/** Params defines the claim module's parameters. */
export interface Params {
  airdropStartTime?: Date;
  durationUntilDecay?: Duration;
  durationOfDecay?: Duration;
  /** denom of claimable asset */
  claimDenom: string;
}

const baseClaimRecord: object = {
  address: "",
  initialClaimableAmount: Long.ZERO,
  actionCompleted: false,
};

export const ClaimRecord = {
  encode(
    message: ClaimRecord,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (!message.initialClaimableAmount.isZero()) {
      writer.uint32(16).int64(message.initialClaimableAmount);
    }
    writer.uint32(26).fork();
    for (const v of message.actionCompleted) {
      writer.bool(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClaimRecord {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseClaimRecord } as ClaimRecord;
    message.actionCompleted = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.initialClaimableAmount = reader.int64() as Long;
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.actionCompleted.push(reader.bool());
            }
          } else {
            message.actionCompleted.push(reader.bool());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ClaimRecord {
    const message = { ...baseClaimRecord } as ClaimRecord;
    message.actionCompleted = [];
    if (object.address !== undefined && object.address !== null) {
      message.address = String(object.address);
    } else {
      message.address = "";
    }
    if (
      object.initialClaimableAmount !== undefined &&
      object.initialClaimableAmount !== null
    ) {
      message.initialClaimableAmount = Long.fromString(
        object.initialClaimableAmount
      );
    } else {
      message.initialClaimableAmount = Long.ZERO;
    }
    if (
      object.actionCompleted !== undefined &&
      object.actionCompleted !== null
    ) {
      for (const e of object.actionCompleted) {
        message.actionCompleted.push(Boolean(e));
      }
    }
    return message;
  },

  toJSON(message: ClaimRecord): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.initialClaimableAmount !== undefined &&
      (obj.initialClaimableAmount = (
        message.initialClaimableAmount || Long.ZERO
      ).toString());
    if (message.actionCompleted) {
      obj.actionCompleted = message.actionCompleted.map((e) => e);
    } else {
      obj.actionCompleted = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ClaimRecord>): ClaimRecord {
    const message = { ...baseClaimRecord } as ClaimRecord;
    message.actionCompleted = [];
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    } else {
      message.address = "";
    }
    if (
      object.initialClaimableAmount !== undefined &&
      object.initialClaimableAmount !== null
    ) {
      message.initialClaimableAmount = object.initialClaimableAmount as Long;
    } else {
      message.initialClaimableAmount = Long.ZERO;
    }
    if (
      object.actionCompleted !== undefined &&
      object.actionCompleted !== null
    ) {
      for (const e of object.actionCompleted) {
        message.actionCompleted.push(e);
      }
    }
    return message;
  },
};

const baseParams: object = { claimDenom: "" };

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.airdropStartTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.airdropStartTime),
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.durationUntilDecay !== undefined) {
      Duration.encode(
        message.durationUntilDecay,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.durationOfDecay !== undefined) {
      Duration.encode(
        message.durationOfDecay,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.claimDenom !== "") {
      writer.uint32(34).string(message.claimDenom);
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
          message.airdropStartTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.durationUntilDecay = Duration.decode(reader, reader.uint32());
          break;
        case 3:
          message.durationOfDecay = Duration.decode(reader, reader.uint32());
          break;
        case 4:
          message.claimDenom = reader.string();
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
    if (
      object.airdropStartTime !== undefined &&
      object.airdropStartTime !== null
    ) {
      message.airdropStartTime = fromJsonTimestamp(object.airdropStartTime);
    } else {
      message.airdropStartTime = undefined;
    }
    if (
      object.durationUntilDecay !== undefined &&
      object.durationUntilDecay !== null
    ) {
      message.durationUntilDecay = Duration.fromJSON(object.durationUntilDecay);
    } else {
      message.durationUntilDecay = undefined;
    }
    if (
      object.durationOfDecay !== undefined &&
      object.durationOfDecay !== null
    ) {
      message.durationOfDecay = Duration.fromJSON(object.durationOfDecay);
    } else {
      message.durationOfDecay = undefined;
    }
    if (object.claimDenom !== undefined && object.claimDenom !== null) {
      message.claimDenom = String(object.claimDenom);
    } else {
      message.claimDenom = "";
    }
    return message;
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.airdropStartTime !== undefined &&
      (obj.airdropStartTime = message.airdropStartTime.toISOString());
    message.durationUntilDecay !== undefined &&
      (obj.durationUntilDecay = message.durationUntilDecay
        ? Duration.toJSON(message.durationUntilDecay)
        : undefined);
    message.durationOfDecay !== undefined &&
      (obj.durationOfDecay = message.durationOfDecay
        ? Duration.toJSON(message.durationOfDecay)
        : undefined);
    message.claimDenom !== undefined && (obj.claimDenom = message.claimDenom);
    return obj;
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params;
    if (
      object.airdropStartTime !== undefined &&
      object.airdropStartTime !== null
    ) {
      message.airdropStartTime = object.airdropStartTime;
    } else {
      message.airdropStartTime = undefined;
    }
    if (
      object.durationUntilDecay !== undefined &&
      object.durationUntilDecay !== null
    ) {
      message.durationUntilDecay = Duration.fromPartial(
        object.durationUntilDecay
      );
    } else {
      message.durationUntilDecay = undefined;
    }
    if (
      object.durationOfDecay !== undefined &&
      object.durationOfDecay !== null
    ) {
      message.durationOfDecay = Duration.fromPartial(object.durationOfDecay);
    } else {
      message.durationOfDecay = undefined;
    }
    if (object.claimDenom !== undefined && object.claimDenom !== null) {
      message.claimDenom = object.claimDenom;
    } else {
      message.claimDenom = "";
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
