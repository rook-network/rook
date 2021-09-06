/* eslint-disable */
import { Timestamp } from '../../google/protobuf/timestamp';
import * as Long from 'long';
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import { Config } from '../../rook/game/game';
import { Duration } from '../../google/protobuf/duration';
export const protobufPackage = 'rook.matchmaker';
const baseRoom = { players: '', pending: '', public: false, quorum: 0, capacity: 0, modeId: 0 };
export const Room = {
    encode(message, writer = Writer.create()) {
        if (message.config !== undefined) {
            Config.encode(message.config, writer.uint32(10).fork()).ldelim();
        }
        for (const v of message.players) {
            writer.uint32(18).string(v);
        }
        for (const v of message.pending) {
            writer.uint32(26).string(v);
        }
        if (message.public === true) {
            writer.uint32(32).bool(message.public);
        }
        if (message.quorum !== 0) {
            writer.uint32(40).uint32(message.quorum);
        }
        if (message.capacity !== 0) {
            writer.uint32(48).uint32(message.capacity);
        }
        if (message.modeId !== 0) {
            writer.uint32(56).uint32(message.modeId);
        }
        if (message.created !== undefined) {
            Timestamp.encode(toTimestamp(message.created), writer.uint32(66).fork()).ldelim();
        }
        if (message.ready !== undefined) {
            Timestamp.encode(toTimestamp(message.ready), writer.uint32(74).fork()).ldelim();
        }
        if (message.scheduled !== undefined) {
            Timestamp.encode(toTimestamp(message.scheduled), writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseRoom };
        message.players = [];
        message.pending = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.config = Config.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.players.push(reader.string());
                    break;
                case 3:
                    message.pending.push(reader.string());
                    break;
                case 4:
                    message.public = reader.bool();
                    break;
                case 5:
                    message.quorum = reader.uint32();
                    break;
                case 6:
                    message.capacity = reader.uint32();
                    break;
                case 7:
                    message.modeId = reader.uint32();
                    break;
                case 8:
                    message.created = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.ready = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
                    break;
                case 10:
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
        const message = { ...baseRoom };
        message.players = [];
        message.pending = [];
        if (object.config !== undefined && object.config !== null) {
            message.config = Config.fromJSON(object.config);
        }
        else {
            message.config = undefined;
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
        }
        else {
            message.public = false;
        }
        if (object.quorum !== undefined && object.quorum !== null) {
            message.quorum = Number(object.quorum);
        }
        else {
            message.quorum = 0;
        }
        if (object.capacity !== undefined && object.capacity !== null) {
            message.capacity = Number(object.capacity);
        }
        else {
            message.capacity = 0;
        }
        if (object.modeId !== undefined && object.modeId !== null) {
            message.modeId = Number(object.modeId);
        }
        else {
            message.modeId = 0;
        }
        if (object.created !== undefined && object.created !== null) {
            message.created = fromJsonTimestamp(object.created);
        }
        else {
            message.created = undefined;
        }
        if (object.ready !== undefined && object.ready !== null) {
            message.ready = fromJsonTimestamp(object.ready);
        }
        else {
            message.ready = undefined;
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
        message.config !== undefined && (obj.config = message.config ? Config.toJSON(message.config) : undefined);
        if (message.players) {
            obj.players = message.players.map((e) => e);
        }
        else {
            obj.players = [];
        }
        if (message.pending) {
            obj.pending = message.pending.map((e) => e);
        }
        else {
            obj.pending = [];
        }
        message.public !== undefined && (obj.public = message.public);
        message.quorum !== undefined && (obj.quorum = message.quorum);
        message.capacity !== undefined && (obj.capacity = message.capacity);
        message.modeId !== undefined && (obj.modeId = message.modeId);
        message.created !== undefined && (obj.created = message.created !== undefined ? message.created.toISOString() : null);
        message.ready !== undefined && (obj.ready = message.ready !== undefined ? message.ready.toISOString() : null);
        message.scheduled !== undefined && (obj.scheduled = message.scheduled !== undefined ? message.scheduled.toISOString() : null);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseRoom };
        message.players = [];
        message.pending = [];
        if (object.config !== undefined && object.config !== null) {
            message.config = Config.fromPartial(object.config);
        }
        else {
            message.config = undefined;
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
        }
        else {
            message.public = false;
        }
        if (object.quorum !== undefined && object.quorum !== null) {
            message.quorum = object.quorum;
        }
        else {
            message.quorum = 0;
        }
        if (object.capacity !== undefined && object.capacity !== null) {
            message.capacity = object.capacity;
        }
        else {
            message.capacity = 0;
        }
        if (object.modeId !== undefined && object.modeId !== null) {
            message.modeId = object.modeId;
        }
        else {
            message.modeId = 0;
        }
        if (object.created !== undefined && object.created !== null) {
            message.created = object.created;
        }
        else {
            message.created = undefined;
        }
        if (object.ready !== undefined && object.ready !== null) {
            message.ready = object.ready;
        }
        else {
            message.ready = undefined;
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
const baseRooms = { ids: 0 };
export const Rooms = {
    encode(message, writer = Writer.create()) {
        writer.uint32(10).fork();
        for (const v of message.ids) {
            writer.uint64(v);
        }
        writer.ldelim();
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseRooms };
        message.ids = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.ids.push(longToNumber(reader.uint64()));
                        }
                    }
                    else {
                        message.ids.push(longToNumber(reader.uint64()));
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
        const message = { ...baseRooms };
        message.ids = [];
        if (object.ids !== undefined && object.ids !== null) {
            for (const e of object.ids) {
                message.ids.push(Number(e));
            }
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.ids) {
            obj.ids = message.ids.map((e) => e);
        }
        else {
            obj.ids = [];
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseRooms };
        message.ids = [];
        if (object.ids !== undefined && object.ids !== null) {
            for (const e of object.ids) {
                message.ids.push(e);
            }
        }
        return message;
    }
};
const baseMode = { quorum: 0, capacity: 0 };
export const Mode = {
    encode(message, writer = Writer.create()) {
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
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMode };
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
    fromJSON(object) {
        const message = { ...baseMode };
        if (object.config !== undefined && object.config !== null) {
            message.config = Config.fromJSON(object.config);
        }
        else {
            message.config = undefined;
        }
        if (object.quorum !== undefined && object.quorum !== null) {
            message.quorum = Number(object.quorum);
        }
        else {
            message.quorum = 0;
        }
        if (object.capacity !== undefined && object.capacity !== null) {
            message.capacity = Number(object.capacity);
        }
        else {
            message.capacity = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.config !== undefined && (obj.config = message.config ? Config.toJSON(message.config) : undefined);
        message.quorum !== undefined && (obj.quorum = message.quorum);
        message.capacity !== undefined && (obj.capacity = message.capacity);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMode };
        if (object.config !== undefined && object.config !== null) {
            message.config = Config.fromPartial(object.config);
        }
        else {
            message.config = undefined;
        }
        if (object.quorum !== undefined && object.quorum !== null) {
            message.quorum = object.quorum;
        }
        else {
            message.quorum = 0;
        }
        if (object.capacity !== undefined && object.capacity !== null) {
            message.capacity = object.capacity;
        }
        else {
            message.capacity = 0;
        }
        return message;
    }
};
const baseParams = {};
export const Params = {
    encode(message, writer = Writer.create()) {
        if (message.roomLifespan !== undefined) {
            Duration.encode(message.roomLifespan, writer.uint32(10).fork()).ldelim();
        }
        if (message.prestartWaitPeriod !== undefined) {
            Duration.encode(message.prestartWaitPeriod, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseParams };
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
    fromJSON(object) {
        const message = { ...baseParams };
        if (object.roomLifespan !== undefined && object.roomLifespan !== null) {
            message.roomLifespan = Duration.fromJSON(object.roomLifespan);
        }
        else {
            message.roomLifespan = undefined;
        }
        if (object.prestartWaitPeriod !== undefined && object.prestartWaitPeriod !== null) {
            message.prestartWaitPeriod = Duration.fromJSON(object.prestartWaitPeriod);
        }
        else {
            message.prestartWaitPeriod = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.roomLifespan !== undefined && (obj.roomLifespan = message.roomLifespan ? Duration.toJSON(message.roomLifespan) : undefined);
        message.prestartWaitPeriod !== undefined && (obj.prestartWaitPeriod = message.prestartWaitPeriod ? Duration.toJSON(message.prestartWaitPeriod) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseParams };
        if (object.roomLifespan !== undefined && object.roomLifespan !== null) {
            message.roomLifespan = Duration.fromPartial(object.roomLifespan);
        }
        else {
            message.roomLifespan = undefined;
        }
        if (object.prestartWaitPeriod !== undefined && object.prestartWaitPeriod !== null) {
            message.prestartWaitPeriod = Duration.fromPartial(object.prestartWaitPeriod);
        }
        else {
            message.prestartWaitPeriod = undefined;
        }
        return message;
    }
};
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
