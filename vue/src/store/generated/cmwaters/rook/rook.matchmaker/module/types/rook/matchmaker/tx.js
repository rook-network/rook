/* eslint-disable */
import { Reader, util, configure, Writer } from 'protobufjs/minimal';
import { Timestamp } from '../../google/protobuf/timestamp';
import * as Long from 'long';
import { Mode } from '../../rook/matchmaker/matchmaker';
export const protobufPackage = 'rook.matchmaker';
const baseMsgHost = { creator: '', invitees: '', public: false };
export const MsgHost = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.mode !== undefined) {
            Mode.encode(message.mode, writer.uint32(18).fork()).ldelim();
        }
        if (message.modeId !== undefined) {
            writer.uint32(24).uint32(message.modeId);
        }
        for (const v of message.invitees) {
            writer.uint32(34).string(v);
        }
        if (message.public === true) {
            writer.uint32(40).bool(message.public);
        }
        if (message.scheduled !== undefined) {
            Timestamp.encode(toTimestamp(message.scheduled), writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgHost };
        message.invitees = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
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
                    message.scheduled = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgHost };
        message.invitees = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = Mode.fromJSON(object.mode);
        }
        else {
            message.mode = undefined;
        }
        if (object.modeId !== undefined && object.modeId !== null) {
            message.modeId = Number(object.modeId);
        }
        else {
            message.modeId = undefined;
        }
        if (object.invitees !== undefined && object.invitees !== null) {
            for (const e of object.invitees) {
                message.invitees.push(String(e));
            }
        }
        if (object.public !== undefined && object.public !== null) {
            message.public = Boolean(object.public);
        }
        else {
            message.public = false;
        }
        if (object.scheduled !== undefined && object.scheduled !== null) {
            message.scheduled = fromJsonTimestamp(object.scheduled);
        }
        else {
            message.scheduled = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.mode !== undefined && (obj.mode = message.mode ? Mode.toJSON(message.mode) : undefined);
        message.modeId !== undefined && (obj.modeId = message.modeId);
        if (message.invitees) {
            obj.invitees = message.invitees.map((e) => e);
        }
        else {
            obj.invitees = [];
        }
        message.public !== undefined && (obj.public = message.public);
        message.scheduled !== undefined && (obj.scheduled = message.scheduled !== undefined ? message.scheduled.toISOString() : null);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgHost };
        message.invitees = [];
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = Mode.fromPartial(object.mode);
        }
        else {
            message.mode = undefined;
        }
        if (object.modeId !== undefined && object.modeId !== null) {
            message.modeId = object.modeId;
        }
        else {
            message.modeId = undefined;
        }
        if (object.invitees !== undefined && object.invitees !== null) {
            for (const e of object.invitees) {
                message.invitees.push(e);
            }
        }
        if (object.public !== undefined && object.public !== null) {
            message.public = object.public;
        }
        else {
            message.public = false;
        }
        if (object.scheduled !== undefined && object.scheduled !== null) {
            message.scheduled = object.scheduled;
        }
        else {
            message.scheduled = undefined;
        }
        return message;
    }
};
const baseMsgHostResponse = { roomId: 0 };
export const MsgHostResponse = {
    encode(message, writer = Writer.create()) {
        if (message.roomId !== 0) {
            writer.uint32(8).uint64(message.roomId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgHostResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.roomId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgHostResponse };
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = Number(object.roomId);
        }
        else {
            message.roomId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.roomId !== undefined && (obj.roomId = message.roomId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgHostResponse };
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = object.roomId;
        }
        else {
            message.roomId = 0;
        }
        return message;
    }
};
const baseMsgJoin = { creator: '', roomId: 0 };
export const MsgJoin = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.roomId !== 0) {
            writer.uint32(16).uint64(message.roomId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgJoin };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.roomId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgJoin };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = Number(object.roomId);
        }
        else {
            message.roomId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.roomId !== undefined && (obj.roomId = message.roomId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgJoin };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = object.roomId;
        }
        else {
            message.roomId = 0;
        }
        return message;
    }
};
const baseMsgJoinResponse = {};
export const MsgJoinResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgJoinResponse };
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
        const message = { ...baseMsgJoinResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgJoinResponse };
        return message;
    }
};
const baseMsgFind = { creator: '', mode: 0 };
export const MsgFind = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.mode !== 0) {
            writer.uint32(16).uint32(message.mode);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgFind };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
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
    fromJSON(object) {
        const message = { ...baseMsgFind };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = Number(object.mode);
        }
        else {
            message.mode = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.mode !== undefined && (obj.mode = message.mode);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgFind };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = object.mode;
        }
        else {
            message.mode = 0;
        }
        return message;
    }
};
const baseMsgFindResponse = { roomId: 0 };
export const MsgFindResponse = {
    encode(message, writer = Writer.create()) {
        if (message.roomId !== 0) {
            writer.uint32(8).uint64(message.roomId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgFindResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.roomId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgFindResponse };
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = Number(object.roomId);
        }
        else {
            message.roomId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.roomId !== undefined && (obj.roomId = message.roomId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgFindResponse };
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = object.roomId;
        }
        else {
            message.roomId = 0;
        }
        return message;
    }
};
const baseMsgLeave = { creator: '', roomId: 0 };
export const MsgLeave = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.roomId !== 0) {
            writer.uint32(16).uint64(message.roomId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgLeave };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.roomId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgLeave };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = Number(object.roomId);
        }
        else {
            message.roomId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.roomId !== undefined && (obj.roomId = message.roomId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgLeave };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.roomId !== undefined && object.roomId !== null) {
            message.roomId = object.roomId;
        }
        else {
            message.roomId = 0;
        }
        return message;
    }
};
const baseMsgLeaveResponse = {};
export const MsgLeaveResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgLeaveResponse };
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
        const message = { ...baseMsgLeaveResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgLeaveResponse };
        return message;
    }
};
const baseMsgAddMode = { authority: '' };
export const MsgAddMode = {
    encode(message, writer = Writer.create()) {
        if (message.authority !== '') {
            writer.uint32(10).string(message.authority);
        }
        if (message.mode !== undefined) {
            Mode.encode(message.mode, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgAddMode };
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
    fromJSON(object) {
        const message = { ...baseMsgAddMode };
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = String(object.authority);
        }
        else {
            message.authority = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = Mode.fromJSON(object.mode);
        }
        else {
            message.mode = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.authority !== undefined && (obj.authority = message.authority);
        message.mode !== undefined && (obj.mode = message.mode ? Mode.toJSON(message.mode) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgAddMode };
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        else {
            message.authority = '';
        }
        if (object.mode !== undefined && object.mode !== null) {
            message.mode = Mode.fromPartial(object.mode);
        }
        else {
            message.mode = undefined;
        }
        return message;
    }
};
const baseMsgAddModeResponse = { id: 0 };
export const MsgAddModeResponse = {
    encode(message, writer = Writer.create()) {
        if (message.id !== 0) {
            writer.uint32(8).uint32(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgAddModeResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgAddModeResponse };
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
        const message = { ...baseMsgAddModeResponse };
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    }
};
const baseMsgRemoveMode = { authority: '', id: 0 };
export const MsgRemoveMode = {
    encode(message, writer = Writer.create()) {
        if (message.authority !== '') {
            writer.uint32(10).string(message.authority);
        }
        if (message.id !== 0) {
            writer.uint32(16).uint32(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgRemoveMode };
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
    fromJSON(object) {
        const message = { ...baseMsgRemoveMode };
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = String(object.authority);
        }
        else {
            message.authority = '';
        }
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
        message.authority !== undefined && (obj.authority = message.authority);
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgRemoveMode };
        if (object.authority !== undefined && object.authority !== null) {
            message.authority = object.authority;
        }
        else {
            message.authority = '';
        }
        if (object.id !== undefined && object.id !== null) {
            message.id = object.id;
        }
        else {
            message.id = 0;
        }
        return message;
    }
};
const baseMsgRemoveModeResponse = {};
export const MsgRemoveModeResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgRemoveModeResponse };
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
        const message = { ...baseMsgRemoveModeResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgRemoveModeResponse };
        return message;
    }
};
export class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    Host(request) {
        const data = MsgHost.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'Host', data);
        return promise.then((data) => MsgHostResponse.decode(new Reader(data)));
    }
    Join(request) {
        const data = MsgJoin.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'Join', data);
        return promise.then((data) => MsgJoinResponse.decode(new Reader(data)));
    }
    Find(request) {
        const data = MsgFind.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'Find', data);
        return promise.then((data) => MsgFindResponse.decode(new Reader(data)));
    }
    Leave(request) {
        const data = MsgLeave.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'Leave', data);
        return promise.then((data) => MsgLeaveResponse.decode(new Reader(data)));
    }
    AddMode(request) {
        const data = MsgAddMode.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'AddMode', data);
        return promise.then((data) => MsgAddModeResponse.decode(new Reader(data)));
    }
    RemoveMode(request) {
        const data = MsgRemoveMode.encode(request).finish();
        const promise = this.rpc.request('rook.matchmaker.Msg', 'RemoveMode', data);
        return promise.then((data) => MsgRemoveModeResponse.decode(new Reader(data)));
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
function toTimestamp(date) {
    const seconds = date.getTime() / 1000;
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = t.seconds * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === 'string') {
        return new Date(o);
    }
    else {
        return fromTimestamp(Timestamp.fromJSON(o));
    }
}
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
