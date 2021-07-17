/* eslint-disable */
import * as Long from 'long';
import { util, configure, Writer, Reader } from 'protobufjs/minimal';
import { ResourceSet } from '../../rook/game/types';
export const protobufPackage = 'rook.game';
const baseGameConfig = {};
export const GameConfig = {
    encode(message, writer = Writer.create()) {
        if (message.initial !== undefined) {
            InitializationConfig.encode(message.initial, writer.uint32(10).fork()).ldelim();
        }
        if (message.map !== undefined) {
            MapConfig.encode(message.map, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseGameConfig };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.initial = InitializationConfig.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.map = MapConfig.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseGameConfig };
        if (object.initial !== undefined && object.initial !== null) {
            message.initial = InitializationConfig.fromJSON(object.initial);
        }
        else {
            message.initial = undefined;
        }
        if (object.map !== undefined && object.map !== null) {
            message.map = MapConfig.fromJSON(object.map);
        }
        else {
            message.map = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.initial !== undefined && (obj.initial = message.initial ? InitializationConfig.toJSON(message.initial) : undefined);
        message.map !== undefined && (obj.map = message.map ? MapConfig.toJSON(message.map) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseGameConfig };
        if (object.initial !== undefined && object.initial !== null) {
            message.initial = InitializationConfig.fromPartial(object.initial);
        }
        else {
            message.initial = undefined;
        }
        if (object.map !== undefined && object.map !== null) {
            message.map = MapConfig.fromPartial(object.map);
        }
        else {
            message.map = undefined;
        }
        return message;
    }
};
const baseMapConfig = { width: 0, height: 0, seed: 0, mountainsDensity: 0, forestDensity: 0, lakeDensity: 0, plainsDensity: 0 };
export const MapConfig = {
    encode(message, writer = Writer.create()) {
        if (message.width !== 0) {
            writer.uint32(8).uint32(message.width);
        }
        if (message.height !== 0) {
            writer.uint32(16).uint32(message.height);
        }
        if (message.seed !== 0) {
            writer.uint32(24).int64(message.seed);
        }
        if (message.mountainsDensity !== 0) {
            writer.uint32(32).uint32(message.mountainsDensity);
        }
        if (message.forestDensity !== 0) {
            writer.uint32(40).uint32(message.forestDensity);
        }
        if (message.lakeDensity !== 0) {
            writer.uint32(48).uint32(message.lakeDensity);
        }
        if (message.plainsDensity !== 0) {
            writer.uint32(56).uint32(message.plainsDensity);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMapConfig };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.width = reader.uint32();
                    break;
                case 2:
                    message.height = reader.uint32();
                    break;
                case 3:
                    message.seed = longToNumber(reader.int64());
                    break;
                case 4:
                    message.mountainsDensity = reader.uint32();
                    break;
                case 5:
                    message.forestDensity = reader.uint32();
                    break;
                case 6:
                    message.lakeDensity = reader.uint32();
                    break;
                case 7:
                    message.plainsDensity = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMapConfig };
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = Number(object.height);
        }
        else {
            message.height = 0;
        }
        if (object.seed !== undefined && object.seed !== null) {
            message.seed = Number(object.seed);
        }
        else {
            message.seed = 0;
        }
        if (object.mountainsDensity !== undefined && object.mountainsDensity !== null) {
            message.mountainsDensity = Number(object.mountainsDensity);
        }
        else {
            message.mountainsDensity = 0;
        }
        if (object.forestDensity !== undefined && object.forestDensity !== null) {
            message.forestDensity = Number(object.forestDensity);
        }
        else {
            message.forestDensity = 0;
        }
        if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
            message.lakeDensity = Number(object.lakeDensity);
        }
        else {
            message.lakeDensity = 0;
        }
        if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
            message.plainsDensity = Number(object.plainsDensity);
        }
        else {
            message.plainsDensity = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.width !== undefined && (obj.width = message.width);
        message.height !== undefined && (obj.height = message.height);
        message.seed !== undefined && (obj.seed = message.seed);
        message.mountainsDensity !== undefined && (obj.mountainsDensity = message.mountainsDensity);
        message.forestDensity !== undefined && (obj.forestDensity = message.forestDensity);
        message.lakeDensity !== undefined && (obj.lakeDensity = message.lakeDensity);
        message.plainsDensity !== undefined && (obj.plainsDensity = message.plainsDensity);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMapConfig };
        if (object.width !== undefined && object.width !== null) {
            message.width = object.width;
        }
        else {
            message.width = 0;
        }
        if (object.height !== undefined && object.height !== null) {
            message.height = object.height;
        }
        else {
            message.height = 0;
        }
        if (object.seed !== undefined && object.seed !== null) {
            message.seed = object.seed;
        }
        else {
            message.seed = 0;
        }
        if (object.mountainsDensity !== undefined && object.mountainsDensity !== null) {
            message.mountainsDensity = object.mountainsDensity;
        }
        else {
            message.mountainsDensity = 0;
        }
        if (object.forestDensity !== undefined && object.forestDensity !== null) {
            message.forestDensity = object.forestDensity;
        }
        else {
            message.forestDensity = 0;
        }
        if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
            message.lakeDensity = object.lakeDensity;
        }
        else {
            message.lakeDensity = 0;
        }
        if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
            message.plainsDensity = object.plainsDensity;
        }
        else {
            message.plainsDensity = 0;
        }
        return message;
    }
};
const baseInitializationConfig = { teams: 0 };
export const InitializationConfig = {
    encode(message, writer = Writer.create()) {
        if (message.teams !== 0) {
            writer.uint32(8).uint32(message.teams);
        }
        if (message.resources !== undefined) {
            ResourceSet.encode(message.resources, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseInitializationConfig };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.teams = reader.uint32();
                    break;
                case 2:
                    message.resources = ResourceSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseInitializationConfig };
        if (object.teams !== undefined && object.teams !== null) {
            message.teams = Number(object.teams);
        }
        else {
            message.teams = 0;
        }
        if (object.resources !== undefined && object.resources !== null) {
            message.resources = ResourceSet.fromJSON(object.resources);
        }
        else {
            message.resources = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.teams !== undefined && (obj.teams = message.teams);
        message.resources !== undefined && (obj.resources = message.resources ? ResourceSet.toJSON(message.resources) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseInitializationConfig };
        if (object.teams !== undefined && object.teams !== null) {
            message.teams = object.teams;
        }
        else {
            message.teams = 0;
        }
        if (object.resources !== undefined && object.resources !== null) {
            message.resources = ResourceSet.fromPartial(object.resources);
        }
        else {
            message.resources = undefined;
        }
        return message;
    }
};
const baseParams = {};
export const Params = {
    encode(message, writer = Writer.create()) {
        Object.entries(message.productionRate).forEach(([key, value]) => {
            Params_ProductionRateEntry.encode({ key: key, value }, writer.uint32(10).fork()).ldelim();
        });
        Object.entries(message.constructionCost).forEach(([key, value]) => {
            Params_ConstructionCostEntry.encode({ key: key, value }, writer.uint32(18).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseParams };
        message.productionRate = {};
        message.constructionCost = {};
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    const entry1 = Params_ProductionRateEntry.decode(reader, reader.uint32());
                    if (entry1.value !== undefined) {
                        message.productionRate[entry1.key] = entry1.value;
                    }
                    break;
                case 2:
                    const entry2 = Params_ConstructionCostEntry.decode(reader, reader.uint32());
                    if (entry2.value !== undefined) {
                        message.constructionCost[entry2.key] = entry2.value;
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
        const message = { ...baseParams };
        message.productionRate = {};
        message.constructionCost = {};
        if (object.productionRate !== undefined && object.productionRate !== null) {
            Object.entries(object.productionRate).forEach(([key, value]) => {
                message.productionRate[Number(key)] = ResourceSet.fromJSON(value);
            });
        }
        if (object.constructionCost !== undefined && object.constructionCost !== null) {
            Object.entries(object.constructionCost).forEach(([key, value]) => {
                message.constructionCost[Number(key)] = ResourceSet.fromJSON(value);
            });
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        obj.productionRate = {};
        if (message.productionRate) {
            Object.entries(message.productionRate).forEach(([k, v]) => {
                obj.productionRate[k] = ResourceSet.toJSON(v);
            });
        }
        obj.constructionCost = {};
        if (message.constructionCost) {
            Object.entries(message.constructionCost).forEach(([k, v]) => {
                obj.constructionCost[k] = ResourceSet.toJSON(v);
            });
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseParams };
        message.productionRate = {};
        message.constructionCost = {};
        if (object.productionRate !== undefined && object.productionRate !== null) {
            Object.entries(object.productionRate).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.productionRate[Number(key)] = ResourceSet.fromPartial(value);
                }
            });
        }
        if (object.constructionCost !== undefined && object.constructionCost !== null) {
            Object.entries(object.constructionCost).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.constructionCost[Number(key)] = ResourceSet.fromPartial(value);
                }
            });
        }
        return message;
    }
};
const baseParams_ProductionRateEntry = { key: 0 };
export const Params_ProductionRateEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint32(message.key);
        }
        if (message.value !== undefined) {
            ResourceSet.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseParams_ProductionRateEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.uint32();
                    break;
                case 2:
                    message.value = ResourceSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseParams_ProductionRateEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = ResourceSet.fromJSON(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? ResourceSet.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseParams_ProductionRateEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = ResourceSet.fromPartial(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    }
};
const baseParams_ConstructionCostEntry = { key: 0 };
export const Params_ConstructionCostEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint32(message.key);
        }
        if (message.value !== undefined) {
            ResourceSet.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseParams_ConstructionCostEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.uint32();
                    break;
                case 2:
                    message.value = ResourceSet.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseParams_ConstructionCostEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = ResourceSet.fromJSON(object.value);
        }
        else {
            message.value = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value ? ResourceSet.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseParams_ConstructionCostEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = ResourceSet.fromPartial(object.value);
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