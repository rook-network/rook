import { Direction, Settlement, Position } from '../rook/types';
import { Reader, Writer } from 'protobufjs/minimal';
import { GameConfig } from '../rook/config';
export declare const protobufPackage = "cmwaters.rook.rook";
export interface MsgMove {
    creator: string;
    gameId: number;
    position: Position | undefined;
    direction: Direction;
    population: number;
}
export interface MsgMoveResponse {
}
export interface MsgBuild {
    creator: string;
    gameId: number;
    settlement: Settlement;
    position: Position | undefined;
}
export interface MsgBuildResponse {
}
export interface MsgCreate {
    /** all players must be signers */
    players: string[];
    config: GameConfig | undefined;
}
export interface MsgCreateResponse {
    gameId: number;
}
export declare const MsgMove: {
    encode(message: MsgMove, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgMove;
    fromJSON(object: any): MsgMove;
    toJSON(message: MsgMove): unknown;
    fromPartial(object: DeepPartial<MsgMove>): MsgMove;
};
export declare const MsgMoveResponse: {
    encode(_: MsgMoveResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgMoveResponse;
    fromJSON(_: any): MsgMoveResponse;
    toJSON(_: MsgMoveResponse): unknown;
    fromPartial(_: DeepPartial<MsgMoveResponse>): MsgMoveResponse;
};
export declare const MsgBuild: {
    encode(message: MsgBuild, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgBuild;
    fromJSON(object: any): MsgBuild;
    toJSON(message: MsgBuild): unknown;
    fromPartial(object: DeepPartial<MsgBuild>): MsgBuild;
};
export declare const MsgBuildResponse: {
    encode(_: MsgBuildResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgBuildResponse;
    fromJSON(_: any): MsgBuildResponse;
    toJSON(_: MsgBuildResponse): unknown;
    fromPartial(_: DeepPartial<MsgBuildResponse>): MsgBuildResponse;
};
export declare const MsgCreate: {
    encode(message: MsgCreate, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgCreate;
    fromJSON(object: any): MsgCreate;
    toJSON(message: MsgCreate): unknown;
    fromPartial(object: DeepPartial<MsgCreate>): MsgCreate;
};
export declare const MsgCreateResponse: {
    encode(message: MsgCreateResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgCreateResponse;
    fromJSON(object: any): MsgCreateResponse;
    toJSON(message: MsgCreateResponse): unknown;
    fromPartial(object: DeepPartial<MsgCreateResponse>): MsgCreateResponse;
};
/** Msg defines the Msg service. */
export interface Msg {
    /** this line is used by starport scaffolding # proto/tx/rpc */
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
    Create(request: MsgCreate): Promise<MsgCreateResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
    Create(request: MsgCreate): Promise<MsgCreateResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
