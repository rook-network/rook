/* eslint-disable */
import { Position, directionFromJSON, directionToJSON, settlementFromJSON, settlementToJSON } from '../rook/types';
import { Reader, util, configure, Writer } from 'protobufjs/minimal';
import * as Long from 'long';
import { GameConfig } from '../rook/config';
export const protobufPackage = 'cmwaters.rook.rook';
const baseMsgMove = { creator: '', gameId: 0, direction: 0, population: 0 };
export const MsgMove = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.gameId !== 0) {
            writer.uint32(16).uint64(message.gameId);
        }
        if (message.position !== undefined) {
            Position.encode(message.position, writer.uint32(26).fork()).ldelim();
        }
        if (message.direction !== 0) {
            writer.uint32(32).int32(message.direction);
        }
        if (message.population !== 0) {
            writer.uint32(40).uint32(message.population);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgMove };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.gameId = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.position = Position.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.direction = reader.int32();
                    break;
                case 5:
                    message.population = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgMove };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = Number(object.gameId);
        }
        else {
            message.gameId = 0;
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = Position.fromJSON(object.position);
        }
        else {
            message.position = undefined;
        }
        if (object.direction !== undefined && object.direction !== null) {
            message.direction = directionFromJSON(object.direction);
        }
        else {
            message.direction = 0;
        }
        if (object.population !== undefined && object.population !== null) {
            message.population = Number(object.population);
        }
        else {
            message.population = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.gameId !== undefined && (obj.gameId = message.gameId);
        message.position !== undefined && (obj.position = message.position ? Position.toJSON(message.position) : undefined);
        message.direction !== undefined && (obj.direction = directionToJSON(message.direction));
        message.population !== undefined && (obj.population = message.population);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgMove };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = object.gameId;
        }
        else {
            message.gameId = 0;
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = Position.fromPartial(object.position);
        }
        else {
            message.position = undefined;
        }
        if (object.direction !== undefined && object.direction !== null) {
            message.direction = object.direction;
        }
        else {
            message.direction = 0;
        }
        if (object.population !== undefined && object.population !== null) {
            message.population = object.population;
        }
        else {
            message.population = 0;
        }
        return message;
    }
};
const baseMsgMoveResponse = {};
export const MsgMoveResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgMoveResponse };
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
        const message = { ...baseMsgMoveResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgMoveResponse };
        return message;
    }
};
const baseMsgBuild = { creator: '', gameId: 0, settlement: 0 };
export const MsgBuild = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.gameId !== 0) {
            writer.uint32(16).uint64(message.gameId);
        }
        if (message.settlement !== 0) {
            writer.uint32(24).int32(message.settlement);
        }
        if (message.position !== undefined) {
            Position.encode(message.position, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgBuild };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.gameId = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.settlement = reader.int32();
                    break;
                case 4:
                    message.position = Position.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgBuild };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = String(object.creator);
        }
        else {
            message.creator = '';
        }
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = Number(object.gameId);
        }
        else {
            message.gameId = 0;
        }
        if (object.settlement !== undefined && object.settlement !== null) {
            message.settlement = settlementFromJSON(object.settlement);
        }
        else {
            message.settlement = 0;
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = Position.fromJSON(object.position);
        }
        else {
            message.position = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.gameId !== undefined && (obj.gameId = message.gameId);
        message.settlement !== undefined && (obj.settlement = settlementToJSON(message.settlement));
        message.position !== undefined && (obj.position = message.position ? Position.toJSON(message.position) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgBuild };
        if (object.creator !== undefined && object.creator !== null) {
            message.creator = object.creator;
        }
        else {
            message.creator = '';
        }
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = object.gameId;
        }
        else {
            message.gameId = 0;
        }
        if (object.settlement !== undefined && object.settlement !== null) {
            message.settlement = object.settlement;
        }
        else {
            message.settlement = 0;
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = Position.fromPartial(object.position);
        }
        else {
            message.position = undefined;
        }
        return message;
    }
};
const baseMsgBuildResponse = {};
export const MsgBuildResponse = {
    encode(_, writer = Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgBuildResponse };
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
        const message = { ...baseMsgBuildResponse };
        return message;
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    fromPartial(_) {
        const message = { ...baseMsgBuildResponse };
        return message;
    }
};
const baseMsgCreate = { players: '' };
export const MsgCreate = {
    encode(message, writer = Writer.create()) {
        for (const v of message.players) {
            writer.uint32(18).string(v);
        }
        if (message.config !== undefined) {
            GameConfig.encode(message.config, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgCreate };
        message.players = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    message.players.push(reader.string());
                    break;
                case 3:
                    message.config = GameConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgCreate };
        message.players = [];
        if (object.players !== undefined && object.players !== null) {
            for (const e of object.players) {
                message.players.push(String(e));
            }
        }
        if (object.config !== undefined && object.config !== null) {
            message.config = GameConfig.fromJSON(object.config);
        }
        else {
            message.config = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.players) {
            obj.players = message.players.map((e) => e);
        }
        else {
            obj.players = [];
        }
        message.config !== undefined && (obj.config = message.config ? GameConfig.toJSON(message.config) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgCreate };
        message.players = [];
        if (object.players !== undefined && object.players !== null) {
            for (const e of object.players) {
                message.players.push(e);
            }
        }
        if (object.config !== undefined && object.config !== null) {
            message.config = GameConfig.fromPartial(object.config);
        }
        else {
            message.config = undefined;
        }
        return message;
    }
};
const baseMsgCreateResponse = { gameId: 0 };
export const MsgCreateResponse = {
    encode(message, writer = Writer.create()) {
        if (message.gameId !== 0) {
            writer.uint32(8).uint64(message.gameId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMsgCreateResponse };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.gameId = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMsgCreateResponse };
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = Number(object.gameId);
        }
        else {
            message.gameId = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.gameId !== undefined && (obj.gameId = message.gameId);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMsgCreateResponse };
        if (object.gameId !== undefined && object.gameId !== null) {
            message.gameId = object.gameId;
        }
        else {
            message.gameId = 0;
        }
        return message;
    }
};
export class MsgClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    Move(request) {
        const data = MsgMove.encode(request).finish();
        const promise = this.rpc.request('cmwaters.rook.rook.Msg', 'Move', data);
        return promise.then((data) => MsgMoveResponse.decode(new Reader(data)));
    }
    Build(request) {
        const data = MsgBuild.encode(request).finish();
        const promise = this.rpc.request('cmwaters.rook.rook.Msg', 'Build', data);
        return promise.then((data) => MsgBuildResponse.decode(new Reader(data)));
    }
    Create(request) {
        const data = MsgCreate.encode(request).finish();
        const promise = this.rpc.request('cmwaters.rook.rook.Msg', 'Create', data);
        return promise.then((data) => MsgCreateResponse.decode(new Reader(data)));
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
