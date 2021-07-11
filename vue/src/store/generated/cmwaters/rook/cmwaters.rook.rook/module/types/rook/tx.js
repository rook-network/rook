/* eslint-disable */
import { Reader, Writer } from 'protobufjs/minimal';
export const protobufPackage = 'cmwaters.rook.rook';
const baseMsgMove = { creator: '', gameId: '', position: '', direction: '', population: '' };
export const MsgMove = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.gameId !== '') {
            writer.uint32(18).string(message.gameId);
        }
        if (message.position !== '') {
            writer.uint32(26).string(message.position);
        }
        if (message.direction !== '') {
            writer.uint32(34).string(message.direction);
        }
        if (message.population !== '') {
            writer.uint32(42).string(message.population);
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
                    message.gameId = reader.string();
                    break;
                case 3:
                    message.position = reader.string();
                    break;
                case 4:
                    message.direction = reader.string();
                    break;
                case 5:
                    message.population = reader.string();
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
            message.gameId = String(object.gameId);
        }
        else {
            message.gameId = '';
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = String(object.position);
        }
        else {
            message.position = '';
        }
        if (object.direction !== undefined && object.direction !== null) {
            message.direction = String(object.direction);
        }
        else {
            message.direction = '';
        }
        if (object.population !== undefined && object.population !== null) {
            message.population = String(object.population);
        }
        else {
            message.population = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.gameId !== undefined && (obj.gameId = message.gameId);
        message.position !== undefined && (obj.position = message.position);
        message.direction !== undefined && (obj.direction = message.direction);
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
            message.gameId = '';
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = object.position;
        }
        else {
            message.position = '';
        }
        if (object.direction !== undefined && object.direction !== null) {
            message.direction = object.direction;
        }
        else {
            message.direction = '';
        }
        if (object.population !== undefined && object.population !== null) {
            message.population = object.population;
        }
        else {
            message.population = '';
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
const baseMsgBuild = { creator: '', gameId: '', settlement: '', position: '' };
export const MsgBuild = {
    encode(message, writer = Writer.create()) {
        if (message.creator !== '') {
            writer.uint32(10).string(message.creator);
        }
        if (message.gameId !== '') {
            writer.uint32(18).string(message.gameId);
        }
        if (message.settlement !== '') {
            writer.uint32(26).string(message.settlement);
        }
        if (message.position !== '') {
            writer.uint32(34).string(message.position);
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
                    message.gameId = reader.string();
                    break;
                case 3:
                    message.settlement = reader.string();
                    break;
                case 4:
                    message.position = reader.string();
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
            message.gameId = String(object.gameId);
        }
        else {
            message.gameId = '';
        }
        if (object.settlement !== undefined && object.settlement !== null) {
            message.settlement = String(object.settlement);
        }
        else {
            message.settlement = '';
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = String(object.position);
        }
        else {
            message.position = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.gameId !== undefined && (obj.gameId = message.gameId);
        message.settlement !== undefined && (obj.settlement = message.settlement);
        message.position !== undefined && (obj.position = message.position);
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
            message.gameId = '';
        }
        if (object.settlement !== undefined && object.settlement !== null) {
            message.settlement = object.settlement;
        }
        else {
            message.settlement = '';
        }
        if (object.position !== undefined && object.position !== null) {
            message.position = object.position;
        }
        else {
            message.position = '';
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
}
