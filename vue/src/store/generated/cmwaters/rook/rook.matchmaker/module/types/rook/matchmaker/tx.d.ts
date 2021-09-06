import { Reader, Writer } from 'protobufjs/minimal';
import { Mode } from '../../rook/matchmaker/matchmaker';
export declare const protobufPackage = "rook.matchmaker";
export interface MsgHost {
    /** The host of the room */
    creator: string;
    /** Mode defines the game config, the quorum and capacity of players */
    mode: Mode | undefined;
    /** Or you can use a predefined mode */
    modeId: number | undefined;
    /** the list of players that are invited to join the room */
    invitees: string[];
    /** public defines whether the room is open for all players to join */
    public: boolean;
    /**
     * For scheduled games (like tournaments). Participants have until
     * then to join. The game only starts if the quorum is met.
     */
    scheduled: Date | undefined;
}
export interface MsgHostResponse {
    roomId: number;
}
export interface MsgJoin {
    creator: string;
    roomId: number;
}
export interface MsgJoinResponse {
}
export interface MsgFind {
    creator: string;
    mode: number;
}
export interface MsgFindResponse {
    roomId: number;
}
export interface MsgLeave {
    creator: string;
    roomId: number;
}
export interface MsgLeaveResponse {
}
export interface MsgAddMode {
    authority: string;
    mode: Mode | undefined;
}
export interface MsgAddModeResponse {
    id: number;
}
export interface MsgRemoveMode {
    authority: string;
    id: number;
}
export interface MsgRemoveModeResponse {
}
export declare const MsgHost: {
    encode(message: MsgHost, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgHost;
    fromJSON(object: any): MsgHost;
    toJSON(message: MsgHost): unknown;
    fromPartial(object: DeepPartial<MsgHost>): MsgHost;
};
export declare const MsgHostResponse: {
    encode(message: MsgHostResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgHostResponse;
    fromJSON(object: any): MsgHostResponse;
    toJSON(message: MsgHostResponse): unknown;
    fromPartial(object: DeepPartial<MsgHostResponse>): MsgHostResponse;
};
export declare const MsgJoin: {
    encode(message: MsgJoin, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgJoin;
    fromJSON(object: any): MsgJoin;
    toJSON(message: MsgJoin): unknown;
    fromPartial(object: DeepPartial<MsgJoin>): MsgJoin;
};
export declare const MsgJoinResponse: {
    encode(_: MsgJoinResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgJoinResponse;
    fromJSON(_: any): MsgJoinResponse;
    toJSON(_: MsgJoinResponse): unknown;
    fromPartial(_: DeepPartial<MsgJoinResponse>): MsgJoinResponse;
};
export declare const MsgFind: {
    encode(message: MsgFind, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgFind;
    fromJSON(object: any): MsgFind;
    toJSON(message: MsgFind): unknown;
    fromPartial(object: DeepPartial<MsgFind>): MsgFind;
};
export declare const MsgFindResponse: {
    encode(message: MsgFindResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgFindResponse;
    fromJSON(object: any): MsgFindResponse;
    toJSON(message: MsgFindResponse): unknown;
    fromPartial(object: DeepPartial<MsgFindResponse>): MsgFindResponse;
};
export declare const MsgLeave: {
    encode(message: MsgLeave, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgLeave;
    fromJSON(object: any): MsgLeave;
    toJSON(message: MsgLeave): unknown;
    fromPartial(object: DeepPartial<MsgLeave>): MsgLeave;
};
export declare const MsgLeaveResponse: {
    encode(_: MsgLeaveResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgLeaveResponse;
    fromJSON(_: any): MsgLeaveResponse;
    toJSON(_: MsgLeaveResponse): unknown;
    fromPartial(_: DeepPartial<MsgLeaveResponse>): MsgLeaveResponse;
};
export declare const MsgAddMode: {
    encode(message: MsgAddMode, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgAddMode;
    fromJSON(object: any): MsgAddMode;
    toJSON(message: MsgAddMode): unknown;
    fromPartial(object: DeepPartial<MsgAddMode>): MsgAddMode;
};
export declare const MsgAddModeResponse: {
    encode(message: MsgAddModeResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgAddModeResponse;
    fromJSON(object: any): MsgAddModeResponse;
    toJSON(message: MsgAddModeResponse): unknown;
    fromPartial(object: DeepPartial<MsgAddModeResponse>): MsgAddModeResponse;
};
export declare const MsgRemoveMode: {
    encode(message: MsgRemoveMode, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgRemoveMode;
    fromJSON(object: any): MsgRemoveMode;
    toJSON(message: MsgRemoveMode): unknown;
    fromPartial(object: DeepPartial<MsgRemoveMode>): MsgRemoveMode;
};
export declare const MsgRemoveModeResponse: {
    encode(_: MsgRemoveModeResponse, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): MsgRemoveModeResponse;
    fromJSON(_: any): MsgRemoveModeResponse;
    toJSON(_: MsgRemoveModeResponse): unknown;
    fromPartial(_: DeepPartial<MsgRemoveModeResponse>): MsgRemoveModeResponse;
};
/** Msg defines the Msg service. */
export interface Msg {
    Host(request: MsgHost): Promise<MsgHostResponse>;
    Join(request: MsgJoin): Promise<MsgJoinResponse>;
    Find(request: MsgFind): Promise<MsgFindResponse>;
    Leave(request: MsgLeave): Promise<MsgLeaveResponse>;
    AddMode(request: MsgAddMode): Promise<MsgAddModeResponse>;
    RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    constructor(rpc: Rpc);
    Host(request: MsgHost): Promise<MsgHostResponse>;
    Join(request: MsgJoin): Promise<MsgJoinResponse>;
    Find(request: MsgFind): Promise<MsgFindResponse>;
    Leave(request: MsgLeave): Promise<MsgLeaveResponse>;
    AddMode(request: MsgAddMode): Promise<MsgAddModeResponse>;
    RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
