import { Writer, Reader } from 'protobufjs/minimal';
export declare const protobufPackage = "cmwaters.rook.rook";
export declare enum Direction {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3,
    UNRECOGNIZED = -1
}
export declare function directionFromJSON(object: any): Direction;
export declare function directionToJSON(object: Direction): string;
export declare enum Landscape {
    UNKNOWN = 0,
    PLAINS = 1,
    FOREST = 2,
    MOUNTAINS = 3,
    LAKE = 4,
    UNRECOGNIZED = -1
}
export declare function landscapeFromJSON(object: any): Landscape;
export declare function landscapeToJSON(object: Landscape): string;
export declare enum Settlement {
    NONE = 0,
    TOWN = 1,
    CITY = 2,
    CAPITAL = 3,
    LUMBERMILL = 4,
    QUARRY = 5,
    FARM = 6,
    ROOK = 7,
    UNRECOGNIZED = -1
}
export declare function settlementFromJSON(object: any): Settlement;
export declare function settlementToJSON(object: Settlement): string;
export interface Map {
    tiles: Tile[];
    width: number;
}
export interface Tile {
    landscape: Landscape;
    faction: string;
}
export interface Faction {
    resources: ResourceSet | undefined;
    population: {
        [key: number]: number;
    };
    settlements: {
        [key: number]: Settlement;
    };
}
export interface Faction_PopulationEntry {
    key: number;
    value: number;
}
export interface Faction_SettlementsEntry {
    key: number;
    value: Settlement;
}
export interface Position {
    x: number;
    y: number;
}
export interface ResourceSet {
    food: number;
    stone: number;
    wood: number;
    population: number;
}
export declare const Map: {
    encode(message: Map, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Map;
    fromJSON(object: any): Map;
    toJSON(message: Map): unknown;
    fromPartial(object: DeepPartial<Map>): Map;
};
export declare const Tile: {
    encode(message: Tile, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Tile;
    fromJSON(object: any): Tile;
    toJSON(message: Tile): unknown;
    fromPartial(object: DeepPartial<Tile>): Tile;
};
export declare const Faction: {
    encode(message: Faction, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Faction;
    fromJSON(object: any): Faction;
    toJSON(message: Faction): unknown;
    fromPartial(object: DeepPartial<Faction>): Faction;
};
export declare const Faction_PopulationEntry: {
    encode(message: Faction_PopulationEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Faction_PopulationEntry;
    fromJSON(object: any): Faction_PopulationEntry;
    toJSON(message: Faction_PopulationEntry): unknown;
    fromPartial(object: DeepPartial<Faction_PopulationEntry>): Faction_PopulationEntry;
};
export declare const Faction_SettlementsEntry: {
    encode(message: Faction_SettlementsEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Faction_SettlementsEntry;
    fromJSON(object: any): Faction_SettlementsEntry;
    toJSON(message: Faction_SettlementsEntry): unknown;
    fromPartial(object: DeepPartial<Faction_SettlementsEntry>): Faction_SettlementsEntry;
};
export declare const Position: {
    encode(message: Position, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Position;
    fromJSON(object: any): Position;
    toJSON(message: Position): unknown;
    fromPartial(object: DeepPartial<Position>): Position;
};
export declare const ResourceSet: {
    encode(message: ResourceSet, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): ResourceSet;
    fromJSON(object: any): ResourceSet;
    toJSON(message: ResourceSet): unknown;
    fromPartial(object: DeepPartial<ResourceSet>): ResourceSet;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
