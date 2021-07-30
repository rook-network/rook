import { Writer, Reader } from 'protobufjs/minimal';
export declare const protobufPackage = "rook.game";
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
export interface Overview {
    map: Map | undefined;
    paramVersion: number;
}
export interface State {
    players: Faction[];
    gaia: Populace[];
    step: number;
}
export interface Map {
    tiles: Landscape[];
    width: number;
}
export interface Faction {
    player: string;
    resources: ResourceSet | undefined;
    population: Populace[];
}
export interface Populace {
    amount: number;
    position: Position | undefined;
    settlement: Settlement;
}
export interface Config {
    initial: InitializationConfig | undefined;
    map: MapConfig | undefined;
}
export interface MapConfig {
    width: number;
    height: number;
    seed: number;
    mountainsDensity: number;
    forestDensity: number;
    lakeDensity: number;
    plainsDensity: number;
}
export interface InitializationConfig {
    teams: number;
    resources: ResourceSet | undefined;
}
export interface Params {
    productionRate: ResourceSet[];
    constructionCost: ResourceSet[];
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
export declare const Overview: {
    encode(message: Overview, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Overview;
    fromJSON(object: any): Overview;
    toJSON(message: Overview): unknown;
    fromPartial(object: DeepPartial<Overview>): Overview;
};
export declare const State: {
    encode(message: State, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): State;
    fromJSON(object: any): State;
    toJSON(message: State): unknown;
    fromPartial(object: DeepPartial<State>): State;
};
export declare const Map: {
    encode(message: Map, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Map;
    fromJSON(object: any): Map;
    toJSON(message: Map): unknown;
    fromPartial(object: DeepPartial<Map>): Map;
};
export declare const Faction: {
    encode(message: Faction, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Faction;
    fromJSON(object: any): Faction;
    toJSON(message: Faction): unknown;
    fromPartial(object: DeepPartial<Faction>): Faction;
};
export declare const Populace: {
    encode(message: Populace, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Populace;
    fromJSON(object: any): Populace;
    toJSON(message: Populace): unknown;
    fromPartial(object: DeepPartial<Populace>): Populace;
};
export declare const Config: {
    encode(message: Config, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Config;
    fromJSON(object: any): Config;
    toJSON(message: Config): unknown;
    fromPartial(object: DeepPartial<Config>): Config;
};
export declare const MapConfig: {
    encode(message: MapConfig, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MapConfig;
    fromJSON(object: any): MapConfig;
    toJSON(message: MapConfig): unknown;
    fromPartial(object: DeepPartial<MapConfig>): MapConfig;
};
export declare const InitializationConfig: {
    encode(message: InitializationConfig, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): InitializationConfig;
    fromJSON(object: any): InitializationConfig;
    toJSON(message: InitializationConfig): unknown;
    fromPartial(object: DeepPartial<InitializationConfig>): InitializationConfig;
};
export declare const Params: {
    encode(message: Params, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    fromPartial(object: DeepPartial<Params>): Params;
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
