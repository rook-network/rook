/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  Room,
  IndexedRoom,
  Params,
  IndexedMode,
} from "../../rook/matchmaker/matchmaker";

export const protobufPackage = "rook.matchmaker";

export interface QueryGetRoomsRequest {}

export interface QueryGetRoomsResponse {
  rooms: IndexedRoom[];
}

export interface QueryGetRoomRequest {
  id: Long;
}

export interface QueryGetRoomResponse {
  room?: Room;
}

export interface QueryRoomByPlayerRequest {
  player: string;
}

export interface QueryRoomByPlayerResponse {
  room?: IndexedRoom;
}

export interface QueryGetInvitationsRequest {
  player: string;
}

export interface QueryGetInvitationsResponse {
  rooms: IndexedRoom[];
}

export interface QueryGetModesRequest {}

export interface QueryGetModesResponse {
  modes: IndexedMode[];
}

export interface QueryGetParamsRequest {}

export interface QueryGetParamsResponse {
  params?: Params;
}

const baseQueryGetRoomsRequest: object = {};

export const QueryGetRoomsRequest = {
  encode(
    _: QueryGetRoomsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetRoomsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetRoomsRequest } as QueryGetRoomsRequest;
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

  fromJSON(_: any): QueryGetRoomsRequest {
    const message = { ...baseQueryGetRoomsRequest } as QueryGetRoomsRequest;
    return message;
  },

  toJSON(_: QueryGetRoomsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryGetRoomsRequest>): QueryGetRoomsRequest {
    const message = { ...baseQueryGetRoomsRequest } as QueryGetRoomsRequest;
    return message;
  },
};

const baseQueryGetRoomsResponse: object = {};

export const QueryGetRoomsResponse = {
  encode(
    message: QueryGetRoomsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.rooms) {
      IndexedRoom.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetRoomsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetRoomsResponse } as QueryGetRoomsResponse;
    message.rooms = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rooms.push(IndexedRoom.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetRoomsResponse {
    const message = { ...baseQueryGetRoomsResponse } as QueryGetRoomsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(IndexedRoom.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryGetRoomsResponse): unknown {
    const obj: any = {};
    if (message.rooms) {
      obj.rooms = message.rooms.map((e) =>
        e ? IndexedRoom.toJSON(e) : undefined
      );
    } else {
      obj.rooms = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetRoomsResponse>
  ): QueryGetRoomsResponse {
    const message = { ...baseQueryGetRoomsResponse } as QueryGetRoomsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(IndexedRoom.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryGetRoomRequest: object = { id: Long.UZERO };

export const QueryGetRoomRequest = {
  encode(
    message: QueryGetRoomRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (!message.id.isZero()) {
      writer.uint32(8).uint64(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetRoomRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest;
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

  fromJSON(object: any): QueryGetRoomRequest {
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = Long.fromString(object.id);
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },

  toJSON(message: QueryGetRoomRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = (message.id || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGetRoomRequest>): QueryGetRoomRequest {
    const message = { ...baseQueryGetRoomRequest } as QueryGetRoomRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id as Long;
    } else {
      message.id = Long.UZERO;
    }
    return message;
  },
};

const baseQueryGetRoomResponse: object = {};

export const QueryGetRoomResponse = {
  encode(
    message: QueryGetRoomResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== undefined) {
      Room.encode(message.room, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetRoomResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = Room.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetRoomResponse {
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse;
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromJSON(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },

  toJSON(message: QueryGetRoomResponse): unknown {
    const obj: any = {};
    message.room !== undefined &&
      (obj.room = message.room ? Room.toJSON(message.room) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<QueryGetRoomResponse>): QueryGetRoomResponse {
    const message = { ...baseQueryGetRoomResponse } as QueryGetRoomResponse;
    if (object.room !== undefined && object.room !== null) {
      message.room = Room.fromPartial(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },
};

const baseQueryRoomByPlayerRequest: object = { player: "" };

export const QueryRoomByPlayerRequest = {
  encode(
    message: QueryRoomByPlayerRequest,
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
  ): QueryRoomByPlayerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRoomByPlayerRequest,
    } as QueryRoomByPlayerRequest;
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

  fromJSON(object: any): QueryRoomByPlayerRequest {
    const message = {
      ...baseQueryRoomByPlayerRequest,
    } as QueryRoomByPlayerRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    return message;
  },

  toJSON(message: QueryRoomByPlayerRequest): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRoomByPlayerRequest>
  ): QueryRoomByPlayerRequest {
    const message = {
      ...baseQueryRoomByPlayerRequest,
    } as QueryRoomByPlayerRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    return message;
  },
};

const baseQueryRoomByPlayerResponse: object = {};

export const QueryRoomByPlayerResponse = {
  encode(
    message: QueryRoomByPlayerResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.room !== undefined) {
      IndexedRoom.encode(message.room, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryRoomByPlayerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryRoomByPlayerResponse,
    } as QueryRoomByPlayerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.room = IndexedRoom.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryRoomByPlayerResponse {
    const message = {
      ...baseQueryRoomByPlayerResponse,
    } as QueryRoomByPlayerResponse;
    if (object.room !== undefined && object.room !== null) {
      message.room = IndexedRoom.fromJSON(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },

  toJSON(message: QueryRoomByPlayerResponse): unknown {
    const obj: any = {};
    message.room !== undefined &&
      (obj.room = message.room ? IndexedRoom.toJSON(message.room) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryRoomByPlayerResponse>
  ): QueryRoomByPlayerResponse {
    const message = {
      ...baseQueryRoomByPlayerResponse,
    } as QueryRoomByPlayerResponse;
    if (object.room !== undefined && object.room !== null) {
      message.room = IndexedRoom.fromPartial(object.room);
    } else {
      message.room = undefined;
    }
    return message;
  },
};

const baseQueryGetInvitationsRequest: object = { player: "" };

export const QueryGetInvitationsRequest = {
  encode(
    message: QueryGetInvitationsRequest,
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
  ): QueryGetInvitationsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetInvitationsRequest,
    } as QueryGetInvitationsRequest;
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

  fromJSON(object: any): QueryGetInvitationsRequest {
    const message = {
      ...baseQueryGetInvitationsRequest,
    } as QueryGetInvitationsRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = String(object.player);
    } else {
      message.player = "";
    }
    return message;
  },

  toJSON(message: QueryGetInvitationsRequest): unknown {
    const obj: any = {};
    message.player !== undefined && (obj.player = message.player);
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetInvitationsRequest>
  ): QueryGetInvitationsRequest {
    const message = {
      ...baseQueryGetInvitationsRequest,
    } as QueryGetInvitationsRequest;
    if (object.player !== undefined && object.player !== null) {
      message.player = object.player;
    } else {
      message.player = "";
    }
    return message;
  },
};

const baseQueryGetInvitationsResponse: object = {};

export const QueryGetInvitationsResponse = {
  encode(
    message: QueryGetInvitationsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.rooms) {
      IndexedRoom.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetInvitationsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseQueryGetInvitationsResponse,
    } as QueryGetInvitationsResponse;
    message.rooms = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rooms.push(IndexedRoom.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetInvitationsResponse {
    const message = {
      ...baseQueryGetInvitationsResponse,
    } as QueryGetInvitationsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(IndexedRoom.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryGetInvitationsResponse): unknown {
    const obj: any = {};
    if (message.rooms) {
      obj.rooms = message.rooms.map((e) =>
        e ? IndexedRoom.toJSON(e) : undefined
      );
    } else {
      obj.rooms = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetInvitationsResponse>
  ): QueryGetInvitationsResponse {
    const message = {
      ...baseQueryGetInvitationsResponse,
    } as QueryGetInvitationsResponse;
    message.rooms = [];
    if (object.rooms !== undefined && object.rooms !== null) {
      for (const e of object.rooms) {
        message.rooms.push(IndexedRoom.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryGetModesRequest: object = {};

export const QueryGetModesRequest = {
  encode(
    _: QueryGetModesRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetModesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest;
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

  fromJSON(_: any): QueryGetModesRequest {
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest;
    return message;
  },

  toJSON(_: QueryGetModesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryGetModesRequest>): QueryGetModesRequest {
    const message = { ...baseQueryGetModesRequest } as QueryGetModesRequest;
    return message;
  },
};

const baseQueryGetModesResponse: object = {};

export const QueryGetModesResponse = {
  encode(
    message: QueryGetModesResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.modes) {
      IndexedMode.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryGetModesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse;
    message.modes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modes.push(IndexedMode.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetModesResponse {
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse;
    message.modes = [];
    if (object.modes !== undefined && object.modes !== null) {
      for (const e of object.modes) {
        message.modes.push(IndexedMode.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: QueryGetModesResponse): unknown {
    const obj: any = {};
    if (message.modes) {
      obj.modes = message.modes.map((e) =>
        e ? IndexedMode.toJSON(e) : undefined
      );
    } else {
      obj.modes = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<QueryGetModesResponse>
  ): QueryGetModesResponse {
    const message = { ...baseQueryGetModesResponse } as QueryGetModesResponse;
    message.modes = [];
    if (object.modes !== undefined && object.modes !== null) {
      for (const e of object.modes) {
        message.modes.push(IndexedMode.fromPartial(e));
      }
    }
    return message;
  },
};

const baseQueryGetParamsRequest: object = {};

export const QueryGetParamsRequest = {
  encode(
    _: QueryGetParamsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest;
    return message;
  },

  toJSON(_: QueryGetParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<QueryGetParamsRequest>): QueryGetParamsRequest {
    const message = { ...baseQueryGetParamsRequest } as QueryGetParamsRequest;
    return message;
  },
};

const baseQueryGetParamsResponse: object = {};

export const QueryGetParamsResponse = {
  encode(
    message: QueryGetParamsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
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
    return message;
  },

  toJSON(message: QueryGetParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined &&
      (obj.params = message.params ? Params.toJSON(message.params) : undefined);
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
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Rooms returns all the public rooms that a player can join */
  Rooms(request: QueryGetRoomsRequest): Promise<QueryGetRoomsResponse>;
  /** Room returns the current state of a specific room */
  Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse>;
  /** Player returns the room that the player is in if any */
  Player(request: QueryRoomByPlayerRequest): Promise<QueryRoomByPlayerResponse>;
  /** Invitations lists all the rooms that a player is invited to */
  Invitations(
    request: QueryGetInvitationsRequest
  ): Promise<QueryGetInvitationsResponse>;
  /** Modes lists all the publicly available modes and their respective room ids */
  Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse>;
  /** Params lists the current matchmaker params */
  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Rooms = this.Rooms.bind(this);
    this.Room = this.Room.bind(this);
    this.Player = this.Player.bind(this);
    this.Invitations = this.Invitations.bind(this);
    this.Modes = this.Modes.bind(this);
    this.Params = this.Params.bind(this);
  }
  Rooms(request: QueryGetRoomsRequest): Promise<QueryGetRoomsResponse> {
    const data = QueryGetRoomsRequest.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Query", "Rooms", data);
    return promise.then((data) =>
      QueryGetRoomsResponse.decode(new _m0.Reader(data))
    );
  }

  Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse> {
    const data = QueryGetRoomRequest.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Query", "Room", data);
    return promise.then((data) =>
      QueryGetRoomResponse.decode(new _m0.Reader(data))
    );
  }

  Player(
    request: QueryRoomByPlayerRequest
  ): Promise<QueryRoomByPlayerResponse> {
    const data = QueryRoomByPlayerRequest.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Query", "Player", data);
    return promise.then((data) =>
      QueryRoomByPlayerResponse.decode(new _m0.Reader(data))
    );
  }

  Invitations(
    request: QueryGetInvitationsRequest
  ): Promise<QueryGetInvitationsResponse> {
    const data = QueryGetInvitationsRequest.encode(request).finish();
    const promise = this.rpc.request(
      "rook.matchmaker.Query",
      "Invitations",
      data
    );
    return promise.then((data) =>
      QueryGetInvitationsResponse.decode(new _m0.Reader(data))
    );
  }

  Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse> {
    const data = QueryGetModesRequest.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Query", "Modes", data);
    return promise.then((data) =>
      QueryGetModesResponse.decode(new _m0.Reader(data))
    );
  }

  Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse> {
    const data = QueryGetParamsRequest.encode(request).finish();
    const promise = this.rpc.request("rook.matchmaker.Query", "Params", data);
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
