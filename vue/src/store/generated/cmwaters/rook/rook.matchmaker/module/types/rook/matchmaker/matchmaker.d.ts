import { Writer, Reader } from 'protobufjs/minimal';
import { Config } from '../../rook/game/game';
import { Duration } from '../../google/protobuf/duration';
export declare const protobufPackage = "rook.matchmaker";
export interface Room {
    /** the config to be used for the game */
    config: Config | undefined;
    /** the current players in the room */
    players: string[];
    /** pending invitations for players that can join (like a whitelist) */
    pending: string[];
    /** anyone can join */
    public: boolean;
    /** the minimum amount of players needed to start a game */
    quorum: number;
    /** the max amount of players that can join the room */
    capacity: number;
    /**
     * if this is part of the standard mode pools it will have a corresponding
     * mode id
     */
    modeId: number;
    /** when the room was created. Rooms get garbage collected after a while */
    created: Date | undefined;
    /**
     * when quorum is reached and we are locked in to starting the game.
     * The prestart_wait_period gives a bufer for more people to join if they
     * want.
     */
    ready: Date | undefined;
    /**
     * the time that the game is scheduled to start. Participants have until
     * then to join. The game only starts if the quorum is met. This is good
     * for tournament games
     */
    scheduled: Date | undefined;
}
/** Rooms represents a set of rooms by id */
export interface Rooms {
    ids: number[];
}
/** Modes are a way of accumulating a small set of possible games that people can choose between */
export interface Mode {
    /** the config to be used for the game */
    config: Config | undefined;
    /** the minimum amount of players needed to start a game */
    quorum: number;
    /** the max amount of players that can join the room */
    capacity: number;
}
export interface Params {
    /**
     * the maximum duration a room can last for before it is closed and all
     * players are kicked
     */
    roomLifespan: Duration | undefined;
    /**
     * the period betwee a quorum of players readying up and the start of the
     * game. This allows a few more players to join
     */
    prestartWaitPeriod: Duration | undefined;
}
export declare const Room: {
    encode(message: Room, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Room;
    fromJSON(object: any): Room;
    toJSON(message: Room): unknown;
    fromPartial(object: DeepPartial<Room>): Room;
};
export declare const Rooms: {
    encode(message: Rooms, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Rooms;
    fromJSON(object: any): Rooms;
    toJSON(message: Rooms): unknown;
    fromPartial(object: DeepPartial<Rooms>): Rooms;
};
export declare const Mode: {
    encode(message: Mode, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Mode;
    fromJSON(object: any): Mode;
    toJSON(message: Mode): unknown;
    fromPartial(object: DeepPartial<Mode>): Mode;
};
export declare const Params: {
    encode(message: Params, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Params;
    fromJSON(object: any): Params;
    toJSON(message: Params): unknown;
    fromPartial(object: DeepPartial<Params>): Params;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
