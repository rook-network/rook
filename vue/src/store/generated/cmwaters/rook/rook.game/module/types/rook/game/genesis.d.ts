import { Writer, Reader } from 'protobufjs/minimal';
import { Params } from '../../rook/game/game';
export declare const protobufPackage = "rook.game";
/** GenesisState defines the rook module's genesis state. */
export interface GenesisState {
    /** the global configuration of all rook games */
    params: Params | undefined;
    paramsVersion: number;
    nextGameId: number;
}
export declare const GenesisState: {
    encode(message: GenesisState, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): GenesisState;
    fromJSON(object: any): GenesisState;
    toJSON(message: GenesisState): unknown;
    fromPartial(object: DeepPartial<GenesisState>): GenesisState;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
