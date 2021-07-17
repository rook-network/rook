import { Writer, Reader } from 'protobufjs/minimal';
import { ResourceSet } from '../../rook/game/types';
export declare const protobufPackage = "rook.game";
export interface GameConfig {
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
    /** maps are indexed by settlement id */
    productionRate: {
        [key: number]: ResourceSet;
    };
    constructionCost: {
        [key: number]: ResourceSet;
    };
}
export interface Params_ProductionRateEntry {
    key: number;
    value: ResourceSet | undefined;
}
export interface Params_ConstructionCostEntry {
    key: number;
    value: ResourceSet | undefined;
}
export declare const GameConfig: {
    encode(message: GameConfig, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): GameConfig;
    fromJSON(object: any): GameConfig;
    toJSON(message: GameConfig): unknown;
    fromPartial(object: DeepPartial<GameConfig>): GameConfig;
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
export declare const Params_ProductionRateEntry: {
    encode(message: Params_ProductionRateEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Params_ProductionRateEntry;
    fromJSON(object: any): Params_ProductionRateEntry;
    toJSON(message: Params_ProductionRateEntry): unknown;
    fromPartial(object: DeepPartial<Params_ProductionRateEntry>): Params_ProductionRateEntry;
};
export declare const Params_ConstructionCostEntry: {
    encode(message: Params_ConstructionCostEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Params_ConstructionCostEntry;
    fromJSON(object: any): Params_ConstructionCostEntry;
    toJSON(message: Params_ConstructionCostEntry): unknown;
    fromPartial(object: DeepPartial<Params_ConstructionCostEntry>): Params_ConstructionCostEntry;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
