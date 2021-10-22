/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "rook.claim";

export interface MsgActivate {
  claimee: string;
}

export interface MsgActivateResponse {
  /** The first installment earned from activating the airdrop */
  claimed?: Coin;
}

const baseMsgActivate: object = { claimee: "" };

export const MsgActivate = {
  encode(
    message: MsgActivate,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.claimee !== "") {
      writer.uint32(10).string(message.claimee);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgActivate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgActivate } as MsgActivate;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.claimee = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgActivate {
    const message = { ...baseMsgActivate } as MsgActivate;
    if (object.claimee !== undefined && object.claimee !== null) {
      message.claimee = String(object.claimee);
    } else {
      message.claimee = "";
    }
    return message;
  },

  toJSON(message: MsgActivate): unknown {
    const obj: any = {};
    message.claimee !== undefined && (obj.claimee = message.claimee);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgActivate>): MsgActivate {
    const message = { ...baseMsgActivate } as MsgActivate;
    if (object.claimee !== undefined && object.claimee !== null) {
      message.claimee = object.claimee;
    } else {
      message.claimee = "";
    }
    return message;
  },
};

const baseMsgActivateResponse: object = {};

export const MsgActivateResponse = {
  encode(
    message: MsgActivateResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.claimed !== undefined) {
      Coin.encode(message.claimed, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgActivateResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMsgActivateResponse } as MsgActivateResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.claimed = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgActivateResponse {
    const message = { ...baseMsgActivateResponse } as MsgActivateResponse;
    if (object.claimed !== undefined && object.claimed !== null) {
      message.claimed = Coin.fromJSON(object.claimed);
    } else {
      message.claimed = undefined;
    }
    return message;
  },

  toJSON(message: MsgActivateResponse): unknown {
    const obj: any = {};
    message.claimed !== undefined &&
      (obj.claimed = message.claimed
        ? Coin.toJSON(message.claimed)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MsgActivateResponse>): MsgActivateResponse {
    const message = { ...baseMsgActivateResponse } as MsgActivateResponse;
    if (object.claimed !== undefined && object.claimed !== null) {
      message.claimed = Coin.fromPartial(object.claimed);
    } else {
      message.claimed = undefined;
    }
    return message;
  },
};

export interface Msg {
  Activate(request: MsgActivate): Promise<MsgActivateResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Activate = this.Activate.bind(this);
  }
  Activate(request: MsgActivate): Promise<MsgActivateResponse> {
    const data = MsgActivate.encode(request).finish();
    const promise = this.rpc.request("rook.claim.Msg", "Activate", data);
    return promise.then((data) =>
      MsgActivateResponse.decode(new _m0.Reader(data))
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
