import { Reader, Writer } from 'protobufjs/minimal';
import { Game } from '../../rook/game/state';
import { Params } from '../../rook/game/config';
export declare const protobufPackage = "rook.game";
/** this line is used by starport scaffolding # 3 */
export interface QueryGetGameRequest {
    id: number;
}
export interface QueryGetGameResponse {
    game: Game | undefined;
}
export interface QueryGetParamsRequest {
}
export interface QueryGetParamsResponse {
    params: Params | undefined;
}
export declare const QueryGetGameRequest: {
    encode(message: QueryGetGameRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetGameRequest;
    fromJSON(object: any): QueryGetGameRequest;
    toJSON(message: QueryGetGameRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetGameRequest>): QueryGetGameRequest;
};
export declare const QueryGetGameResponse: {
    encode(message: QueryGetGameResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetGameResponse;
    fromJSON(object: any): QueryGetGameResponse;
    toJSON(message: QueryGetGameResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetGameResponse>): QueryGetGameResponse;
};
export declare const QueryGetParamsRequest: {
    encode(_: QueryGetParamsRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetParamsRequest;
    fromJSON(_: any): QueryGetParamsRequest;
    toJSON(_: QueryGetParamsRequest): unknown;
    fromPartial(_: DeepPartial<QueryGetParamsRequest>): QueryGetParamsRequest;
};
export declare const QueryGetParamsResponse: {
    encode(message: QueryGetParamsResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetParamsResponse;
    fromJSON(object: any): QueryGetParamsResponse;
    toJSON(message: QueryGetParamsResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetParamsResponse>): QueryGetParamsResponse;
};
/** Query defines the gRPC querier service. */
export interface Query {
    /** Queries a game state by id. */
    Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>;
    Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>;
    Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
