import { Direction, Settlement, Config, Params } from '../../rook/game/game';
import { Reader, Writer } from 'protobufjs/minimal';
export declare const protobufPackage = "rook.game";
export interface MsgMove {
    creator: string;
    gameId: number;
    populace: number;
    direction: Direction;
    population: number;
}
export interface MsgMoveResponse {
}
export interface MsgBuild {
    creator: string;
    gameId: number;
    populace: number;
    settlement: Settlement;
}
export interface MsgBuildResponse {
}
export interface MsgCreate {
    /** all players must be signers */
    players: string[];
    config: Config | undefined;
}
export interface MsgCreateResponse {
    gameId: number;
}
export interface MsgChangeParams {
    authority: string;
    params: Params | undefined;
}
export interface MsgChangeParamsResponse {
    version: number;
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
export declare const MsgChangeParams: {
    encode(message: MsgChangeParams, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgChangeParams;
    fromJSON(object: any): MsgChangeParams;
    toJSON(message: MsgChangeParams): unknown;
    fromPartial(object: DeepPartial<MsgChangeParams>): MsgChangeParams;
};
export declare const MsgChangeParamsResponse: {
    encode(message: MsgChangeParamsResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgChangeParamsResponse;
    fromJSON(object: any): MsgChangeParamsResponse;
    toJSON(message: MsgChangeParamsResponse): unknown;
    fromPartial(object: DeepPartial<MsgChangeParamsResponse>): MsgChangeParamsResponse;
};
/** Msg defines the Msg service. */
export interface Msg {
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
    Create(request: MsgCreate): Promise<MsgCreateResponse>;
    ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
    Create(request: MsgCreate): Promise<MsgCreateResponse>;
    ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
