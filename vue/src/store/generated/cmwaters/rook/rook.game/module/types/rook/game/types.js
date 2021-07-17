/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';
export const protobufPackage = 'rook.game';
export var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["RIGHT"] = 1] = "RIGHT";
    Direction[Direction["UP"] = 2] = "UP";
    Direction[Direction["DOWN"] = 3] = "DOWN";
    Direction[Direction["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Direction || (Direction = {}));
export function directionFromJSON(object) {
    switch (object) {
        case 0:
        case 'LEFT':
            return Direction.LEFT;
        case 1:
        case 'RIGHT':
            return Direction.RIGHT;
        case 2:
        case 'UP':
            return Direction.UP;
        case 3:
        case 'DOWN':
            return Direction.DOWN;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Direction.UNRECOGNIZED;
    }
}
export function directionToJSON(object) {
    switch (object) {
        case Direction.LEFT:
            return 'LEFT';
        case Direction.RIGHT:
            return 'RIGHT';
        case Direction.UP:
            return 'UP';
        case Direction.DOWN:
            return 'DOWN';
        default:
            return 'UNKNOWN';
    }
}
export var Landscape;
(function (Landscape) {
    Landscape[Landscape["UNKNOWN"] = 0] = "UNKNOWN";
    Landscape[Landscape["PLAINS"] = 1] = "PLAINS";
    Landscape[Landscape["FOREST"] = 2] = "FOREST";
    Landscape[Landscape["MOUNTAINS"] = 3] = "MOUNTAINS";
    Landscape[Landscape["LAKE"] = 4] = "LAKE";
    Landscape[Landscape["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Landscape || (Landscape = {}));
export function landscapeFromJSON(object) {
    switch (object) {
        case 0:
        case 'UNKNOWN':
            return Landscape.UNKNOWN;
        case 1:
        case 'PLAINS':
            return Landscape.PLAINS;
        case 2:
        case 'FOREST':
            return Landscape.FOREST;
        case 3:
        case 'MOUNTAINS':
            return Landscape.MOUNTAINS;
        case 4:
        case 'LAKE':
            return Landscape.LAKE;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Landscape.UNRECOGNIZED;
    }
}
export function landscapeToJSON(object) {
    switch (object) {
        case Landscape.UNKNOWN:
            return 'UNKNOWN';
        case Landscape.PLAINS:
            return 'PLAINS';
        case Landscape.FOREST:
            return 'FOREST';
        case Landscape.MOUNTAINS:
            return 'MOUNTAINS';
        case Landscape.LAKE:
            return 'LAKE';
        default:
            return 'UNKNOWN';
    }
}
export var Settlement;
(function (Settlement) {
    Settlement[Settlement["NONE"] = 0] = "NONE";
    Settlement[Settlement["TOWN"] = 1] = "TOWN";
    Settlement[Settlement["CITY"] = 2] = "CITY";
    Settlement[Settlement["CAPITAL"] = 3] = "CAPITAL";
    Settlement[Settlement["LUMBERMILL"] = 4] = "LUMBERMILL";
    Settlement[Settlement["QUARRY"] = 5] = "QUARRY";
    Settlement[Settlement["FARM"] = 6] = "FARM";
    Settlement[Settlement["ROOK"] = 7] = "ROOK";
    Settlement[Settlement["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(Settlement || (Settlement = {}));
export function settlementFromJSON(object) {
    switch (object) {
        case 0:
        case 'NONE':
            return Settlement.NONE;
        case 1:
        case 'TOWN':
            return Settlement.TOWN;
        case 2:
        case 'CITY':
            return Settlement.CITY;
        case 3:
        case 'CAPITAL':
            return Settlement.CAPITAL;
        case 4:
        case 'LUMBERMILL':
            return Settlement.LUMBERMILL;
        case 5:
        case 'QUARRY':
            return Settlement.QUARRY;
        case 6:
        case 'FARM':
            return Settlement.FARM;
        case 7:
        case 'ROOK':
            return Settlement.ROOK;
        case -1:
        case 'UNRECOGNIZED':
        default:
            return Settlement.UNRECOGNIZED;
    }
}
export function settlementToJSON(object) {
    switch (object) {
        case Settlement.NONE:
            return 'NONE';
        case Settlement.TOWN:
            return 'TOWN';
        case Settlement.CITY:
            return 'CITY';
        case Settlement.CAPITAL:
            return 'CAPITAL';
        case Settlement.LUMBERMILL:
            return 'LUMBERMILL';
        case Settlement.QUARRY:
            return 'QUARRY';
        case Settlement.FARM:
            return 'FARM';
        case Settlement.ROOK:
            return 'ROOK';
        default:
            return 'UNKNOWN';
    }
}
const baseMap = { width: 0 };
export const Map = {
    encode(message, writer = Writer.create()) {
        for (const v of message.tiles) {
            Tile.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.width !== 0) {
            writer.uint32(16).uint32(message.width);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseMap };
        message.tiles = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.tiles.push(Tile.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.width = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseMap };
        message.tiles = [];
        if (object.tiles !== undefined && object.tiles !== null) {
            for (const e of object.tiles) {
                message.tiles.push(Tile.fromJSON(e));
            }
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = Number(object.width);
        }
        else {
            message.width = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.tiles) {
            obj.tiles = message.tiles.map((e) => (e ? Tile.toJSON(e) : undefined));
        }
        else {
            obj.tiles = [];
        }
        message.width !== undefined && (obj.width = message.width);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseMap };
        message.tiles = [];
        if (object.tiles !== undefined && object.tiles !== null) {
            for (const e of object.tiles) {
                message.tiles.push(Tile.fromPartial(e));
            }
        }
        if (object.width !== undefined && object.width !== null) {
            message.width = object.width;
        }
        else {
            message.width = 0;
        }
        return message;
    }
};
const baseTile = { landscape: 0, faction: '' };
export const Tile = {
    encode(message, writer = Writer.create()) {
        if (message.landscape !== 0) {
            writer.uint32(8).int32(message.landscape);
        }
        if (message.faction !== '') {
            writer.uint32(18).string(message.faction);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseTile };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.landscape = reader.int32();
                    break;
                case 2:
                    message.faction = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseTile };
        if (object.landscape !== undefined && object.landscape !== null) {
            message.landscape = landscapeFromJSON(object.landscape);
        }
        else {
            message.landscape = 0;
        }
        if (object.faction !== undefined && object.faction !== null) {
            message.faction = String(object.faction);
        }
        else {
            message.faction = '';
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.landscape !== undefined && (obj.landscape = landscapeToJSON(message.landscape));
        message.faction !== undefined && (obj.faction = message.faction);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseTile };
        if (object.landscape !== undefined && object.landscape !== null) {
            message.landscape = object.landscape;
        }
        else {
            message.landscape = 0;
        }
        if (object.faction !== undefined && object.faction !== null) {
            message.faction = object.faction;
        }
        else {
            message.faction = '';
        }
        return message;
    }
};
const baseFaction = {};
export const Faction = {
    encode(message, writer = Writer.create()) {
        if (message.resources !== undefined) {
            ResourceSet.encode(message.resources, writer.uint32(10).fork()).ldelim();
        }
        Object.entries(message.population).forEach(([key, value]) => {
            Faction_PopulationEntry.encode({ key: key, value }, writer.uint32(18).fork()).ldelim();
        });
        Object.entries(message.settlements).forEach(([key, value]) => {
            Faction_SettlementsEntry.encode({ key: key, value }, writer.uint32(26).fork()).ldelim();
        });
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseFaction };
        message.population = {};
        message.settlements = {};
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.resources = ResourceSet.decode(reader, reader.uint32());
                    break;
                case 2:
                    const entry2 = Faction_PopulationEntry.decode(reader, reader.uint32());
                    if (entry2.value !== undefined) {
                        message.population[entry2.key] = entry2.value;
                    }
                    break;
                case 3:
                    const entry3 = Faction_SettlementsEntry.decode(reader, reader.uint32());
                    if (entry3.value !== undefined) {
                        message.settlements[entry3.key] = entry3.value;
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
        const message = { ...baseFaction };
        message.population = {};
        message.settlements = {};
        if (object.resources !== undefined && object.resources !== null) {
            message.resources = ResourceSet.fromJSON(object.resources);
        }
        else {
            message.resources = undefined;
        }
        if (object.population !== undefined && object.population !== null) {
            Object.entries(object.population).forEach(([key, value]) => {
                message.population[Number(key)] = Number(value);
            });
        }
        if (object.settlements !== undefined && object.settlements !== null) {
            Object.entries(object.settlements).forEach(([key, value]) => {
                message.settlements[Number(key)] = value;
            });
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.resources !== undefined && (obj.resources = message.resources ? ResourceSet.toJSON(message.resources) : undefined);
        obj.population = {};
        if (message.population) {
            Object.entries(message.population).forEach(([k, v]) => {
                obj.population[k] = v;
            });
        }
        obj.settlements = {};
        if (message.settlements) {
            Object.entries(message.settlements).forEach(([k, v]) => {
                obj.settlements[k] = settlementToJSON(v);
            });
        }
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseFaction };
        message.population = {};
        message.settlements = {};
        if (object.resources !== undefined && object.resources !== null) {
            message.resources = ResourceSet.fromPartial(object.resources);
        }
        else {
            message.resources = undefined;
        }
        if (object.population !== undefined && object.population !== null) {
            Object.entries(object.population).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.population[Number(key)] = Number(value);
                }
            });
        }
        if (object.settlements !== undefined && object.settlements !== null) {
            Object.entries(object.settlements).forEach(([key, value]) => {
                if (value !== undefined) {
                    message.settlements[Number(key)] = value;
                }
            });
        }
        return message;
    }
};
const baseFaction_PopulationEntry = { key: 0, value: 0 };
export const Faction_PopulationEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint32(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(16).uint32(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseFaction_PopulationEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.uint32();
                    break;
                case 2:
                    message.value = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseFaction_PopulationEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = Number(object.value);
        }
        else {
            message.value = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseFaction_PopulationEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = object.value;
        }
        else {
            message.value = 0;
        }
        return message;
    }
};
const baseFaction_SettlementsEntry = { key: 0, value: 0 };
export const Faction_SettlementsEntry = {
    encode(message, writer = Writer.create()) {
        if (message.key !== 0) {
            writer.uint32(8).uint32(message.key);
        }
        if (message.value !== 0) {
            writer.uint32(16).int32(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseFaction_SettlementsEntry };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.uint32();
                    break;
                case 2:
                    message.value = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...baseFaction_SettlementsEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = Number(object.key);
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = settlementFromJSON(object.value);
        }
        else {
            message.value = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = settlementToJSON(message.value));
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseFaction_SettlementsEntry };
        if (object.key !== undefined && object.key !== null) {
            message.key = object.key;
        }
        else {
            message.key = 0;
        }
        if (object.value !== undefined && object.value !== null) {
            message.value = object.value;
        }
        else {
            message.value = 0;
        }
        return message;
    }
};
const basePosition = { x: 0, y: 0 };
export const Position = {
    encode(message, writer = Writer.create()) {
        if (message.x !== 0) {
            writer.uint32(24).uint32(message.x);
        }
        if (message.y !== 0) {
            writer.uint32(32).uint32(message.y);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...basePosition };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 3:
                    message.x = reader.uint32();
                    break;
                case 4:
                    message.y = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = { ...basePosition };
        if (object.x !== undefined && object.x !== null) {
            message.x = Number(object.x);
        }
        else {
            message.x = 0;
        }
        if (object.y !== undefined && object.y !== null) {
            message.y = Number(object.y);
        }
        else {
            message.y = 0;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.x !== undefined && (obj.x = message.x);
        message.y !== undefined && (obj.y = message.y);
        return obj;
    },
    fromPartial(object) {
        const message = { ...basePosition };
        if (object.x !== undefined && object.x !== null) {
            message.x = object.x;
        }
        else {
            message.x = 0;
        }
        if (object.y !== undefined && object.y !== null) {
            message.y = object.y;
        }
        else {
            message.y = 0;
        }
        return message;
    }
};
const baseResourceSet = { food: 0, stone: 0, wood: 0, population: 0 };
export const ResourceSet = {
    encode(message, writer = Writer.create()) {
        if (message.food !== 0) {
            writer.uint32(8).uint32(message.food);
        }
        if (message.stone !== 0) {
            writer.uint32(16).uint32(message.stone);
        }
        if (message.wood !== 0) {
            writer.uint32(24).uint32(message.wood);
        }
        if (message.population !== 0) {
            writer.uint32(32).uint32(message.population);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseResourceSet };
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.food = reader.uint32();
                    break;
                case 2:
                    message.stone = reader.uint32();
                    break;
                case 3:
                    message.wood = reader.uint32();
                    break;
                case 4:
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
        const message = { ...baseResourceSet };
        if (object.food !== undefined && object.food !== null) {
            message.food = Number(object.food);
        }
        else {
            message.food = 0;
        }
        if (object.stone !== undefined && object.stone !== null) {
            message.stone = Number(object.stone);
        }
        else {
            message.stone = 0;
        }
        if (object.wood !== undefined && object.wood !== null) {
            message.wood = Number(object.wood);
        }
        else {
            message.wood = 0;
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
        message.food !== undefined && (obj.food = message.food);
        message.stone !== undefined && (obj.stone = message.stone);
        message.wood !== undefined && (obj.wood = message.wood);
        message.population !== undefined && (obj.population = message.population);
        return obj;
    },
    fromPartial(object) {
        const message = { ...baseResourceSet };
        if (object.food !== undefined && object.food !== null) {
            message.food = object.food;
        }
        else {
            message.food = 0;
        }
        if (object.stone !== undefined && object.stone !== null) {
            message.stone = object.stone;
        }
        else {
            message.stone = 0;
        }
        if (object.wood !== undefined && object.wood !== null) {
            message.wood = object.wood;
        }
        else {
            message.wood = 0;
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
