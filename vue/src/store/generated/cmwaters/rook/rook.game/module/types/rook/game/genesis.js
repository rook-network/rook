/* eslint-disable */
import * as Long from 'long';
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import { Params } from '../../rook/game/game';
export const protobufPackage = 'rook.game';
const baseGenesisState = { paramsVersion: 0, nextGameId: 0 };
export const GenesisState = {
    encode(message, writer = Writer.create()) {
        if (message.params !== undefined) {
            Params.encode(message.params, writer.uint32(10).fork()).ldelim();
        }
        if (message.paramsVersion !== 0) {
            writer.uint32(16).uint32(message.paramsVersion);
        }
        if (message.nextGameId !== 0) {
            writer.uint32(24).uint64(message.nextGameId);
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
                    message.paramsVersion = reader.uint32();
                    break;
                case 3:
                    message.nextGameId = longToNumber(reader.uint64());
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
        if (object.paramsVersion !== undefined && object.paramsVersion !== null) {
            message.paramsVersion = Number(object.paramsVersion);
        }
        else {
            message.paramsVersion = 0;
        }
        if (object.nextGameId !== undefined && object.nextGameId !== null) {
            message.nextGameId = Number(object.nextGameId);
        }
        else {
            message.nextGameId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
        message.paramsVersion !== undefined && (obj.paramsVersion = message.paramsVersion);
        message.nextGameId !== undefined && (obj.nextGameId = message.nextGameId);
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
        if (object.paramsVersion !== undefined && object.paramsVersion !== null) {
            message.paramsVersion = object.paramsVersion;
        }
        else {
            message.paramsVersion = 0;
        }
        if (object.nextGameId !== undefined && object.nextGameId !== null) {
            message.nextGameId = object.nextGameId;
        }
        else {
            message.nextGameId = 0;
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
