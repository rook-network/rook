/* eslint-disable */
import { Reader, util, configure, Writer } from 'protobufjs/minimal';
import * as Long from 'long';
import { Room, Mode, Params } from '../../rook/matchmaker/matchmaker';
export const protobufPackage = 'rook.matchmaker';
const baseQueryGetRoomRequest = { id: 0 };
export const QueryGetRoomRequest = {
    encode(message, writer = Writer.create()) {
        if (message.id !== 0) {
            writer.uint32(8).uint64(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetRoomRequest };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseQueryGetRoomRequest };
        if (object.id !== undefined && object.id !== null) {
            message.id = Number(object.id);
        }
        else {
            message.id = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetRoomRequest };
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    }
};
const baseQueryGetRoomResponse = {};
export const QueryGetRoomResponse = {
    encode(message, writer = Writer.create()) {
        if (message.room !== undefined) {
            Room.encode(message.room, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetRoomResponse };
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
    fromJSON(object) {
        const message = { ...baseQueryGetRoomResponse };
        if (object.room !== undefined && object.room !== null) {
            message.room = Room.fromJSON(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.room !== undefined && (obj.room = message.room ? Room.toJSON(message.room) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetRoomResponse };
        if (object.room !== undefined && object.room !== null) {
            message.room = Room.fromPartial(object.room);
        }
        else {
            message.room = undefined;
        }
        return message;
    }
};
const baseQueryGetInvitationsRequest = { player: '' };
export const QueryGetInvitationsRequest = {
    encode(message, writer = Writer.create()) {
        if (message.player !== '') {
            writer.uint32(10).string(message.player);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetInvitationsRequest };
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
    fromJSON(object) {
        const message = { ...baseQueryGetInvitationsRequest };
        if (object.player !== undefined && object.player !== null) {
            message.player = String(object.player);
        }
        else {
            message.player = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.player !== undefined && (obj.player = message.player);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetInvitationsRequest };
        if (object.player !== undefined && object.player !== null) {
            message.player = object.player;
        }
        else {
            message.player = '';
        }
        return message;
    }
};
const baseQueryGetInvitationsResponse = {};
export const QueryGetInvitationsResponse = {
    encode(message, writer = Writer.create()) {
        Object.entries(message.rooms).forEach(([key, value]) => {
            QueryGetInvitationsResponse_RoomsEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetInvitationsResponse };
        message.rooms = {};
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = QueryGetInvitationsResponse_RoomsEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.rooms[entry1.key] = entry1.value;
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseQueryGetInvitationsResponse };
        message.rooms = {};
        if (object.rooms !== undefined && object.rooms !== null) {
            Object.entries(object.rooms).forEach(([key, value]) => {
                message.rooms[Number(key)] = Room.fromJSON(value);
            });
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        obj.rooms = {};
        if (message.rooms) {
            Object.entries(message.rooms).forEach(([k, v]) => {
                obj.rooms[k] = Room.toJSON(v);
            });
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetInvitationsResponse };
        message.rooms = {};
        if (object.rooms !== undefined && object.rooms !== null) {
            Object.entries(object.rooms).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.rooms[Number(key)] = Room.fromPartial(value);
                }
            });
        }
        return message;
    }
};
const baseQueryGetInvitationsResponse_RoomsEntry = { key: 0 };
export const QueryGetInvitationsResponse_RoomsEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint64(message.key);
        }
        if (message.value !== undefined) {
            Room.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetInvitationsResponse_RoomsEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.value = Room.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseQueryGetInvitationsResponse_RoomsEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Room.fromJSON(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? Room.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetInvitationsResponse_RoomsEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Room.fromPartial(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    }
};
const baseQueryGetModesRequest = {};
export const QueryGetModesRequest = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetModesRequest };
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
    fromJSON(_) {
        const message = { ...baseQueryGetModesRequest };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseQueryGetModesRequest };
        return message;
    }
};
const baseQueryGetModesResponse = {};
export const QueryGetModesResponse = {
    encode(message, writer = Writer.create()) {
        Object.entries(message.modes).forEach(([key, value]) => {
            QueryGetModesResponse_ModesEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetModesResponse };
        message.modes = {};
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = QueryGetModesResponse_ModesEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.modes[entry1.key] = entry1.value;
                    }
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseQueryGetModesResponse };
        message.modes = {};
        if (object.modes !== undefined && object.modes !== null) {
            Object.entries(object.modes).forEach(([key, value]) => {
                message.modes[Number(key)] = Mode.fromJSON(value);
            });
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        obj.modes = {};
        if (message.modes) {
            Object.entries(message.modes).forEach(([k, v]) => {
                obj.modes[k] = Mode.toJSON(v);
            });
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetModesResponse };
        message.modes = {};
        if (object.modes !== undefined && object.modes !== null) {
            Object.entries(object.modes).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.modes[Number(key)] = Mode.fromPartial(value);
                }
            });
        }
        return message;
    }
};
const baseQueryGetModesResponse_ModesEntry = { key: 0 };
export const QueryGetModesResponse_ModesEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint32(message.key);
        }
        if (message.value !== undefined) {
            Mode.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetModesResponse_ModesEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.uint32();
                    break;
                case 2:
                    message.value = Mode.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseQueryGetModesResponse_ModesEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Mode.fromJSON(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? Mode.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetModesResponse_ModesEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Mode.fromPartial(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    }
};
const baseQueryGetParamsRequest = {};
export const QueryGetParamsRequest = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetParamsRequest };
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
    fromJSON(_) {
        const message = { ...baseQueryGetParamsRequest };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseQueryGetParamsRequest };
        return message;
    }
};
const baseQueryGetParamsResponse = {};
export const QueryGetParamsResponse = {
    encode(message, writer = Writer.create()) {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseQueryGetParamsResponse };
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
    fromJSON(object) {
        const message = { ...baseQueryGetParamsResponse };
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseQueryGetParamsResponse };
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        return message;
    }
};
export class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    Room(request) {
        const data = QueryGetRoomRequest.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Query', 'Room', data);
        return promise.then((data) => QueryGetRoomResponse.decode(new Reader(data)));
    }
    Invitations(request) {
        const data = QueryGetInvitationsRequest.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Query', 'Invitations', data);
        return promise.then((data) => QueryGetInvitationsResponse.decode(new Reader(data)));
    }
    Modes(request) {
        const data = QueryGetModesRequest.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Query', 'Modes', data);
        return promise.then((data) => QueryGetModesResponse.decode(new Reader(data)));
    }
    Params(request) {
        const data = QueryGetParamsRequest.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Query', 'Params', data);
        return promise.then((data) => QueryGetParamsResponse.decode(new Reader(data)));
    }
}
var globalThis = (() => {
    if (typeof globalThis !== 'undefined')
        return globalThis;
    if (typeof self !== 'undefined')
        return self;
    if (typeof window !== 'undefined')
        return window;
    if (typeof global !== 'undefined')
        return global;
    throw 'Unable to locate global object';
})();
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
    }
    return long.toNumber();
}
if (util.Long !== Long) {
    util.Long = Long;
    configure();
}
