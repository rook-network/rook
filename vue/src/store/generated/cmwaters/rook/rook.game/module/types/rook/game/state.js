/* eslint-disable */
import * as Long from 'long';
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import { Faction, Map } from '../../rook/game/types';
import { GameConfig } from '../../rook/game/config';
export const protobufPackage = 'rook.game';
const baseGame = { step: 0 };
export const Game = {
    encode(message, writer = Writer.create()) {
        Object.entries(message.players).forEach(([key, value]) => {
            Game_PlayersEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
        });
        if (message.config !== undefined) {
            GameConfig.encode(message.config, writer.uint32(18).fork()).ldelim();
        }
        if (message.step !== 0) {
            writer.uint32(24).uint64(message.step);
        }
        if (message.map !== undefined) {
            Map.encode(message.map, writer.uint32(34).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGame };
        message.players = {};
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = Game_PlayersEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.players[entry1.key] = entry1.value;
                    }
                    break;
                case 2:
                    message.config = GameConfig.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.step = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.map = Map.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGame };
        message.players = {};
        if (object.players !== undefined && object.players !== null) {
            Object.entries(object.players).forEach(([key, value]) => {
                message.players[key] = Faction.fromJSON(value);
            });
        }
        if (object.config !== undefined && object.config !== null) {
            message.config = GameConfig.fromJSON(object.config);
        }
        else {
            message.config = undefined;
        }
        if (object.step !== undefined && object.step !== null) {
            message.step = Number(object.step);
        }
        else {
            message.step = 0;
        }
        if (object.map !== undefined && object.map !== null) {
            message.map = Map.fromJSON(object.map);
        }
        else {
            message.map = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        obj.players = {};
        if (message.players) {
            Object.entries(message.players).forEach(([k, v]) => {
                obj.players[k] = Faction.toJSON(v);
            });
        }
        message.config !== undefined && (obj.config = message.config ? GameConfig.toJSON(message.config) : undefined);
        message.step !== undefined && (obj.step = message.step);
        message.map !== undefined && (obj.map = message.map ? Map.toJSON(message.map) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGame };
        message.players = {};
        if (object.players !== undefined && object.players !== null) {
            Object.entries(object.players).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.players[key] = Faction.fromPartial(value);
                }
            });
        }
        if (object.config !== undefined && object.config !== null) {
            message.config = GameConfig.fromPartial(object.config);
        }
        else {
            message.config = undefined;
        }
        if (object.step !== undefined && object.step !== null) {
            message.step = object.step;
        }
        else {
            message.step = 0;
        }
        if (object.map !== undefined && object.map !== null) {
            message.map = Map.fromPartial(object.map);
        }
        else {
            message.map = undefined;
        }
        return message;
    }
};
const baseGame_PlayersEntry = { key: '' };
export const Game_PlayersEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== '') {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            Faction.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGame_PlayersEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = Faction.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGame_PlayersEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = String(object.key);
        }
        else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Faction.fromJSON(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? Faction.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGame_PlayersEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = '';
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Faction.fromPartial(object.value);
        }
        else {
            message.value = undefined;
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
