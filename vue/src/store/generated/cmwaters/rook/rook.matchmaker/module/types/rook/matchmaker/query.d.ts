import { Reader, Writer } from 'protobufjs/minimal';
import { Room, Mode, Params } from '../../rook/matchmaker/matchmaker';
export declare const protobufPackage = "rook.matchmaker";
export interface QueryGetRoomRequest {
    id: number;
}
export interface QueryGetRoomResponse {
    room: Room | undefined;
}
export interface QueryGetInvitationsRequest {
    player: string;
}
export interface QueryGetInvitationsResponse {
    rooms: {
        [key: number]: Room;
    };
}
export interface QueryGetInvitationsResponse_RoomsEntry {
    key: number;
    value: Room | undefined;
}
export interface QueryGetModesRequest {
}
export interface QueryGetModesResponse {
    modes: {
        [key: number]: Mode;
    };
}
export interface QueryGetModesResponse_ModesEntry {
    key: number;
    value: Mode | undefined;
}
export interface QueryGetParamsRequest {
}
export interface QueryGetParamsResponse {
    params: Params | undefined;
}
export declare const QueryGetRoomRequest: {
    encode(message: QueryGetRoomRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetRoomRequest;
    fromJSON(object: any): QueryGetRoomRequest;
    toJSON(message: QueryGetRoomRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetRoomRequest>): QueryGetRoomRequest;
};
export declare const QueryGetRoomResponse: {
    encode(message: QueryGetRoomResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetRoomResponse;
    fromJSON(object: any): QueryGetRoomResponse;
    toJSON(message: QueryGetRoomResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetRoomResponse>): QueryGetRoomResponse;
};
export declare const QueryGetInvitationsRequest: {
    encode(message: QueryGetInvitationsRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsRequest;
    fromJSON(object: any): QueryGetInvitationsRequest;
    toJSON(message: QueryGetInvitationsRequest): unknown;
    fromPartial(object: DeepPartial<QueryGetInvitationsRequest>): QueryGetInvitationsRequest;
};
export declare const QueryGetInvitationsResponse: {
    encode(message: QueryGetInvitationsResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsResponse;
    fromJSON(object: any): QueryGetInvitationsResponse;
    toJSON(message: QueryGetInvitationsResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetInvitationsResponse>): QueryGetInvitationsResponse;
};
export declare const QueryGetInvitationsResponse_RoomsEntry: {
    encode(message: QueryGetInvitationsResponse_RoomsEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetInvitationsResponse_RoomsEntry;
    fromJSON(object: any): QueryGetInvitationsResponse_RoomsEntry;
    toJSON(message: QueryGetInvitationsResponse_RoomsEntry): unknown;
    fromPartial(object: DeepPartial<QueryGetInvitationsResponse_RoomsEntry>): QueryGetInvitationsResponse_RoomsEntry;
};
export declare const QueryGetModesRequest: {
    encode(_: QueryGetModesRequest, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetModesRequest;
    fromJSON(_: any): QueryGetModesRequest;
    toJSON(_: QueryGetModesRequest): unknown;
    fromPartial(_: DeepPartial<QueryGetModesRequest>): QueryGetModesRequest;
};
export declare const QueryGetModesResponse: {
    encode(message: QueryGetModesResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetModesResponse;
    fromJSON(object: any): QueryGetModesResponse;
    toJSON(message: QueryGetModesResponse): unknown;
    fromPartial(object: DeepPartial<QueryGetModesResponse>): QueryGetModesResponse;
};
export declare const QueryGetModesResponse_ModesEntry: {
    encode(message: QueryGetModesResponse_ModesEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): QueryGetModesResponse_ModesEntry;
    fromJSON(object: any): QueryGetModesResponse_ModesEntry;
    toJSON(message: QueryGetModesResponse_ModesEntry): unknown;
    fromPartial(object: DeepPartial<QueryGetModesResponse_ModesEntry>): QueryGetModesResponse_ModesEntry;
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
    /** Room returns the current state of a specific room */
    Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse>;
    /** Invitations lists all the rooms that a player is invited to */
    Invitations(request: QueryGetInvitationsRequest): Promise<QueryGetInvitationsResponse>;
    /** Modes lists all the public available modes */
    Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse>;
    /** Params lists the current matchmaker params */
    Params(request: QueryGetParamsRequest): Promise<QueryGetParamsResponse>;
}
export declare class QueryClientImpl implements Query {
    private readonly rpc;
    constructor(rpc: Rpc);
    Room(request: QueryGetRoomRequest): Promise<QueryGetRoomResponse>;
    Invitations(request: QueryGetInvitationsRequest): Promise<QueryGetInvitationsResponse>;
    Modes(request: QueryGetModesRequest): Promise<QueryGetModesResponse>;
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
