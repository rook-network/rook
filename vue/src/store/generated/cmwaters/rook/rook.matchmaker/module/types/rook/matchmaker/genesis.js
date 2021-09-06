/* eslint-disable */
import * as Long from 'long';
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import { Params } from '../../rook/matchmaker/matchmaker';
export const protobufPackage = 'rook.matchmaker';
const baseGenesisState = { nextModeId: 0, nextRoomId: 0 };
export const GenesisState = {
    encode(message, writer = Writer.create()) {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        if (message.nextModeId !== 0) {
            writer.uint32(16).uint32(message.nextModeId);
        }
        if (message.nextRoomId !== 0) {
            writer.uint32(24).uint64(message.nextRoomId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGenesisState };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.params = Params.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.nextModeId = reader.uint32();
                    break;
                case 3:
                    message.nextRoomId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGenesisState };
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromJSON(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.nextModeId !== undefined && object.nextModeId !== null) {
            message.nextModeId = Number(object.nextModeId);
        }
        else {
            message.nextModeId = 0;
        }
        if (object.nextRoomId !== undefined && object.nextRoomId !== null) {
            message.nextRoomId = Number(object.nextRoomId);
        }
        else {
            message.nextRoomId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        message.nextModeId !== undefined && (obj.nextModeId = message.nextModeId);
        message.nextRoomId !== undefined && (obj.nextRoomId = message.nextRoomId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGenesisState };
        if (object.params !== undefined && object.params !== null) {
            message.params = Params.fromPartial(object.params);
        }
        else {
            message.params = undefined;
        }
        if (object.nextModeId !== undefined && object.nextModeId !== null) {
            message.nextModeId = object.nextModeId;
        }
        else {
            message.nextModeId = 0;
        }
        if (object.nextRoomId !== undefined && object.nextRoomId !== null) {
            message.nextRoomId = object.nextRoomId;
        }
        else {
            message.nextRoomId = 0;
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
