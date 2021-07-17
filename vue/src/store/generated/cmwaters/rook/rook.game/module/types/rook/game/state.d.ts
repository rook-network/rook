import { Writer, Reader } from 'protobufjs/minimal';
import { Faction, Map } from '../../rook/game/types';
import { GameConfig } from '../../rook/game/config';
export declare const protobufPackage = "rook.game";
export interface Game {
    players: {
        [key: string]: Faction;
    };
    config: GameConfig | undefined;
    step: number;
    map: Map | undefined;
}
export interface Game_PlayersEntry {
    key: string;
    value: Faction | undefined;
}
export declare const Game: {
    encode(message: Game, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Game;
    fromJSON(object: any): Game;
    toJSON(message: Game): unknown;
    fromPartial(object: DeepPartial<Game>): Game;
};
export declare const Game_PlayersEntry: {
    encode(message: Game_PlayersEntry, writer?: Writer): Writer;
    decode(input: Reader | Uint8Array, length?: number): Game_PlayersEntry;
    fromJSON(object: any): Game_PlayersEntry;
    toJSON(message: Game_PlayersEntry): unknown;
    fromPartial(object: DeepPartial<Game_PlayersEntry>): Game_PlayersEntry;
};
declare type Builtin = Date | Function | Uint8Array | string | number | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export {};
