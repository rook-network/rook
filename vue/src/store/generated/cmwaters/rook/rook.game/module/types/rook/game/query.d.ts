import { Reader, Writer } from 'protobufjs/minimal';
import { State, Overview, Params } from '../../rook/game/game';
export declare const protobufPackage = "rook.game";
/** this line is used by starport scaffolding # 3 */
export interface QueryGetGameStateRequest {
    id: number;
}
export interface QueryGetGameStateResponse {
    gameState: State | undefined;
}
export interface QueryGetGameRequest {
    id: number;
}
export interface QueryGetGameResponse {
    players: string[];
    overview: Overview | undefined;
}
export interface QueryGetParamsRequest {
    version: number;
}
export interface QueryGetParamsResponse {
    params: Params | undefined;
}
export declare const QueryGetGameStateRequest: {
    encode(message: QueryGetGameStateRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetGameStateRequest;
    fromJSON(object: any): QueryGetGameStateRequest;
    toJSON(message: QueryGetGameStateRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetGameStateRequest>): QueryGetGameStateRequest;
};
export declare const QueryGetGameStateResponse: {
    encode(message: QueryGetGameStateResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetGameStateResponse;
    fromJSON(object: any): QueryGetGameStateResponse;
    toJSON(message: QueryGetGameStateResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetGameStateResponse>): QueryGetGameStateResponse;
};
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
    encode(message: QueryGetParamsRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetParamsRequest;
    fromJSON(object: any): QueryGetParamsRequest;
    toJSON(message: QueryGetParamsRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetParamsRequest>): QueryGetParamsRequest;
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
    GameState(request: QueryGetGameStateRequest): Promise<QueryGetGameStateResponse>;
    Game(request: QueryGetGameRequest): Promise<QueryGetGameResponse>;
    Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    GameState(request: QueryGetGameStateRequest): Promise<QueryGetGameStateResponse>;
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
