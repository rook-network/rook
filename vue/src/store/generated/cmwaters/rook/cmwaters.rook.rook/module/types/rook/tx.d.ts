import { Reader, Writer } from 'protobufjs/minimal';
export declare const protobufPackage = "cmwaters.rook.rook";
/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgMove {
    creator: string;
    gameId: string;
    position: string;
    direction: string;
    population: string;
}
export interface MsgMoveResponse {
}
export interface MsgBuild {
    creator: string;
    gameId: string;
    settlement: string;
    position: string;
}
export interface MsgBuildResponse {
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
/** Msg defines the Msg service. */
export interface Msg {
    /** this line is used by starport scaffolding # proto/tx/rpc */
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Move(request: MsgMove): Promise<MsgMoveResponse>;
    Build(request: MsgBuild): Promise<MsgBuildResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
