/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "rook.game";

export enum Direction {
  LEFT = 0,
  RIGHT = 1,
  UP = 2,
  DOWN = 3,
  UNRECOGNIZED = -1,
}

export function directionFromJSON(object: any): Direction {
  switch (object) {
    case 0:
    case "LEFT":
      return Direction.LEFT;
    case 1:
    case "RIGHT":
      return Direction.RIGHT;
    case 2:
    case "UP":
      return Direction.UP;
    case 3:
    case "DOWN":
      return Direction.DOWN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Direction.UNRECOGNIZED;
  }
}

export function directionToJSON(object: Direction): string {
  switch (object) {
    case Direction.LEFT:
      return "LEFT";
    case Direction.RIGHT:
      return "RIGHT";
    case Direction.UP:
      return "UP";
    case Direction.DOWN:
      return "DOWN";
    default:
      return "UNKNOWN";
  }
}

export enum Landscape {
  UNKNOWN = 0,
  PLAINS = 1,
  FOREST = 2,
  MOUNTAINS = 3,
  LAKE = 4,
  UNRECOGNIZED = -1,
}

export function landscapeFromJSON(object: any): Landscape {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return Landscape.UNKNOWN;
    case 1:
    case "PLAINS":
      return Landscape.PLAINS;
    case 2:
    case "FOREST":
      return Landscape.FOREST;
    case 3:
    case "MOUNTAINS":
      return Landscape.MOUNTAINS;
    case 4:
    case "LAKE":
      return Landscape.LAKE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Landscape.UNRECOGNIZED;
  }
}

export function landscapeToJSON(object: Landscape): string {
  switch (object) {
    case Landscape.UNKNOWN:
      return "UNKNOWN";
    case Landscape.PLAINS:
      return "PLAINS";
    case Landscape.FOREST:
      return "FOREST";
    case Landscape.MOUNTAINS:
      return "MOUNTAINS";
    case Landscape.LAKE:
      return "LAKE";
    default:
      return "UNKNOWN";
  }
}

export enum Settlement {
  NONE = 0,
  TOWN = 1,
  CITY = 2,
  CAPITAL = 3,
  LUMBERMILL = 4,
  QUARRY = 5,
  FARM = 6,
  ROOK = 7,
  UNRECOGNIZED = -1,
}

export function settlementFromJSON(object: any): Settlement {
  switch (object) {
    case 0:
    case "NONE":
      return Settlement.NONE;
    case 1:
    case "TOWN":
      return Settlement.TOWN;
    case 2:
    case "CITY":
      return Settlement.CITY;
    case 3:
    case "CAPITAL":
      return Settlement.CAPITAL;
    case 4:
    case "LUMBERMILL":
      return Settlement.LUMBERMILL;
    case 5:
    case "QUARRY":
      return Settlement.QUARRY;
    case 6:
    case "FARM":
      return Settlement.FARM;
    case 7:
    case "ROOK":
      return Settlement.ROOK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Settlement.UNRECOGNIZED;
  }
}

export function settlementToJSON(object: Settlement): string {
  switch (object) {
    case Settlement.NONE:
      return "NONE";
    case Settlement.TOWN:
      return "TOWN";
    case Settlement.CITY:
      return "CITY";
    case Settlement.CAPITAL:
      return "CAPITAL";
    case Settlement.LUMBERMILL:
      return "LUMBERMILL";
    case Settlement.QUARRY:
      return "QUARRY";
    case Settlement.FARM:
      return "FARM";
    case Settlement.ROOK:
      return "ROOK";
    default:
      return "UNKNOWN";
  }
}

/**
 * Game is what is the in memory state and includes a map of territories
 * used for faster look up. Full game is not persisted to disk (Overview and
 * State are)
 */
export interface Game {
  players: string[];
  map?: Map;
  state?: State;
  paramVersion: number;
  territory: { [key: number]: Territory };
}

export interface Game_TerritoryEntry {
  key: number;
  value?: Territory;
}

/**
 * GameSnapshot contains a complete snapshot representation of the state of any
 * game. The object is used to trans
 */
export interface GameSnapshot {
  map?: Map;
  state?: State;
  paramVersion: number;
}

/** Overview is the fixed aspect of the game */
export interface Overview {
  players: string[];
  map?: Map;
  paramVersion: number;
}

/**
 * State is the variable aspect of the game that
 * changes per step
 */
export interface State {
  factions: Faction[];
  gaia: Populace[];
  step: Long;
}

/** Map represents the 2D grid of various landscapes */
export interface Map {
  tiles: Landscape[];
  width: number;
}

/**
 * Factions are a combination of resources and populace
 * that are controlled by one or more players
 */
export interface Faction {
  players: string[];
  resources?: ResourceSet;
  population: Populace[];
}

/**
 * A populace is a group of people. They may be
 * wandering or part of a settlement
 */
export interface Populace {
  amount: number;
  position?: Position;
  settlement: Settlement;
  used: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface ResourceSet {
  food: number;
  stone: number;
  wood: number;
  population: number;
  tech: number;
}

export interface Territory {
  faction: number;
  populace: number;
}

const baseGame: object = { players: "", paramVersion: 0 };

export const Game = {
  encode(message: Game, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.players) {
      writer.uint32(10).string(v!);
    }
    if (message.map !== undefined) {
      Map.encode(message.map, writer.uint32(18).fork()).ldelim();
    }
    if (message.state !== undefined) {
      State.encode(message.state, writer.uint32(26).fork()).ldelim();
    }
    if (message.paramVersion !== 0) {
      writer.uint32(32).uint32(message.paramVersion);
    }
    Object.entries(message.territory).forEach(([key, value]) => {
      Game_TerritoryEntry.encode(
        { key: key as any, value },
        writer.uint32(42).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Game {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGame } as Game;
    message.players = [];
    message.territory = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.players.push(reader.string());
          break;
        case 2:
          message.map = Map.decode(reader, reader.uint32());
          break;
        case 3:
          message.state = State.decode(reader, reader.uint32());
          break;
        case 4:
          message.paramVersion = reader.uint32();
          break;
        case 5:
          const entry5 = Game_TerritoryEntry.decode(reader, reader.uint32());
          if (entry5.value !== undefined) {
            message.territory[entry5.key] = entry5.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Game {
    const message = { ...baseGame } as Game;
    message.players = [];
    message.territory = {};
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(String(e));
      }
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromJSON(object.map);
    } else {
      message.map = undefined;
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromJSON(object.state);
    } else {
      message.state = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = Number(object.paramVersion);
    } else {
      message.paramVersion = 0;
    }
    if (object.territory !== undefined && object.territory !== null) {
      Object.entries(object.territory).forEach(([key, value]) => {
        message.territory[Number(key)] = Territory.fromJSON(value);
      });
    }
    return message;
  },

  toJSON(message: Game): unknown {
    const obj: any = {};
    if (message.players) {
      obj.players = message.players.map((e) => e);
    } else {
      obj.players = [];
    }
    message.map !== undefined &&
      (obj.map = message.map ? Map.toJSON(message.map) : undefined);
    message.state !== undefined &&
      (obj.state = message.state ? State.toJSON(message.state) : undefined);
    message.paramVersion !== undefined &&
      (obj.paramVersion = message.paramVersion);
    obj.territory = {};
    if (message.territory) {
      Object.entries(message.territory).forEach(([k, v]) => {
        obj.territory[k] = Territory.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Game>): Game {
    const message = { ...baseGame } as Game;
    message.players = [];
    message.territory = {};
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(e);
      }
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromPartial(object.map);
    } else {
      message.map = undefined;
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromPartial(object.state);
    } else {
      message.state = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = object.paramVersion;
    } else {
      message.paramVersion = 0;
    }
    if (object.territory !== undefined && object.territory !== null) {
      Object.entries(object.territory).forEach(([key, value]) => {
        if (value !== undefined) {
          message.territory[Number(key)] = Territory.fromPartial(value);
        }
      });
    }
    return message;
  },
};

const baseGame_TerritoryEntry: object = { key: 0 };

export const Game_TerritoryEntry = {
  encode(
    message: Game_TerritoryEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== 0) {
      writer.uint32(8).uint32(message.key);
    }
    if (message.value !== undefined) {
      Territory.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Game_TerritoryEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGame_TerritoryEntry } as Game_TerritoryEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.uint32();
          break;
        case 2:
          message.value = Territory.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Game_TerritoryEntry {
    const message = { ...baseGame_TerritoryEntry } as Game_TerritoryEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = Number(object.key);
    } else {
      message.key = 0;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Territory.fromJSON(object.value);
    } else {
      message.value = undefined;
    }
    return message;
  },

  toJSON(message: Game_TerritoryEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Territory.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Game_TerritoryEntry>): Game_TerritoryEntry {
    const message = { ...baseGame_TerritoryEntry } as Game_TerritoryEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    } else {
      message.key = 0;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Territory.fromPartial(object.value);
    } else {
      message.value = undefined;
    }
    return message;
  },
};

const baseGameSnapshot: object = { paramVersion: 0 };

export const GameSnapshot = {
  encode(
    message: GameSnapshot,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.map !== undefined) {
      Map.encode(message.map, writer.uint32(10).fork()).ldelim();
    }
    if (message.state !== undefined) {
      State.encode(message.state, writer.uint32(18).fork()).ldelim();
    }
    if (message.paramVersion !== 0) {
      writer.uint32(24).uint32(message.paramVersion);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GameSnapshot {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGameSnapshot } as GameSnapshot;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.map = Map.decode(reader, reader.uint32());
          break;
        case 2:
          message.state = State.decode(reader, reader.uint32());
          break;
        case 3:
          message.paramVersion = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GameSnapshot {
    const message = { ...baseGameSnapshot } as GameSnapshot;
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromJSON(object.map);
    } else {
      message.map = undefined;
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromJSON(object.state);
    } else {
      message.state = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = Number(object.paramVersion);
    } else {
      message.paramVersion = 0;
    }
    return message;
  },

  toJSON(message: GameSnapshot): unknown {
    const obj: any = {};
    message.map !== undefined &&
      (obj.map = message.map ? Map.toJSON(message.map) : undefined);
    message.state !== undefined &&
      (obj.state = message.state ? State.toJSON(message.state) : undefined);
    message.paramVersion !== undefined &&
      (obj.paramVersion = message.paramVersion);
    return obj;
  },

  fromPartial(object: DeepPartial<GameSnapshot>): GameSnapshot {
    const message = { ...baseGameSnapshot } as GameSnapshot;
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromPartial(object.map);
    } else {
      message.map = undefined;
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = State.fromPartial(object.state);
    } else {
      message.state = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = object.paramVersion;
    } else {
      message.paramVersion = 0;
    }
    return message;
  },
};

const baseOverview: object = { players: "", paramVersion: 0 };

export const Overview = {
  encode(
    message: Overview,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.players) {
      writer.uint32(10).string(v!);
    }
    if (message.map !== undefined) {
      Map.encode(message.map, writer.uint32(18).fork()).ldelim();
    }
    if (message.paramVersion !== 0) {
      writer.uint32(24).uint32(message.paramVersion);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Overview {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOverview } as Overview;
    message.players = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.players.push(reader.string());
          break;
        case 2:
          message.map = Map.decode(reader, reader.uint32());
          break;
        case 3:
          message.paramVersion = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Overview {
    const message = { ...baseOverview } as Overview;
    message.players = [];
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(String(e));
      }
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromJSON(object.map);
    } else {
      message.map = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = Number(object.paramVersion);
    } else {
      message.paramVersion = 0;
    }
    return message;
  },

  toJSON(message: Overview): unknown {
    const obj: any = {};
    if (message.players) {
      obj.players = message.players.map((e) => e);
    } else {
      obj.players = [];
    }
    message.map !== undefined &&
      (obj.map = message.map ? Map.toJSON(message.map) : undefined);
    message.paramVersion !== undefined &&
      (obj.paramVersion = message.paramVersion);
    return obj;
  },

  fromPartial(object: DeepPartial<Overview>): Overview {
    const message = { ...baseOverview } as Overview;
    message.players = [];
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(e);
      }
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = Map.fromPartial(object.map);
    } else {
      message.map = undefined;
    }
    if (object.paramVersion !== undefined && object.paramVersion !== null) {
      message.paramVersion = object.paramVersion;
    } else {
      message.paramVersion = 0;
    }
    return message;
  },
};

const baseState: object = { step: Long.UZERO };

export const State = {
  encode(message: State, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.factions) {
      Faction.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.gaia) {
      Populace.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (!message.step.isZero()) {
      writer.uint32(24).uint64(message.step);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): State {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseState } as State;
    message.factions = [];
    message.gaia = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.factions.push(Faction.decode(reader, reader.uint32()));
          break;
        case 2:
          message.gaia.push(Populace.decode(reader, reader.uint32()));
          break;
        case 3:
          message.step = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): State {
    const message = { ...baseState } as State;
    message.factions = [];
    message.gaia = [];
    if (object.factions !== undefined && object.factions !== null) {
      for (const e of object.factions) {
        message.factions.push(Faction.fromJSON(e));
      }
    }
    if (object.gaia !== undefined && object.gaia !== null) {
      for (const e of object.gaia) {
        message.gaia.push(Populace.fromJSON(e));
      }
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = Long.fromString(object.step);
    } else {
      message.step = Long.UZERO;
    }
    return message;
  },

  toJSON(message: State): unknown {
    const obj: any = {};
    if (message.factions) {
      obj.factions = message.factions.map((e) =>
        e ? Faction.toJSON(e) : undefined
      );
    } else {
      obj.factions = [];
    }
    if (message.gaia) {
      obj.gaia = message.gaia.map((e) => (e ? Populace.toJSON(e) : undefined));
    } else {
      obj.gaia = [];
    }
    message.step !== undefined &&
      (obj.step = (message.step || Long.UZERO).toString());
    return obj;
  },

  fromPartial(object: DeepPartial<State>): State {
    const message = { ...baseState } as State;
    message.factions = [];
    message.gaia = [];
    if (object.factions !== undefined && object.factions !== null) {
      for (const e of object.factions) {
        message.factions.push(Faction.fromPartial(e));
      }
    }
    if (object.gaia !== undefined && object.gaia !== null) {
      for (const e of object.gaia) {
        message.gaia.push(Populace.fromPartial(e));
      }
    }
    if (object.step !== undefined && object.step !== null) {
      message.step = object.step as Long;
    } else {
      message.step = Long.UZERO;
    }
    return message;
  },
};

const baseMap: object = { tiles: 0, width: 0 };

export const Map = {
  encode(message: Map, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.tiles) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.width !== 0) {
      writer.uint32(16).uint32(message.width);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Map {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMap } as Map;
    message.tiles = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.tiles.push(reader.int32() as any);
            }
          } else {
            message.tiles.push(reader.int32() as any);
          }
          break;
        case 2:
          message.width = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Map {
    const message = { ...baseMap } as Map;
    message.tiles = [];
    if (object.tiles !== undefined && object.tiles !== null) {
      for (const e of object.tiles) {
        message.tiles.push(landscapeFromJSON(e));
      }
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = Number(object.width);
    } else {
      message.width = 0;
    }
    return message;
  },

  toJSON(message: Map): unknown {
    const obj: any = {};
    if (message.tiles) {
      obj.tiles = message.tiles.map((e) => landscapeToJSON(e));
    } else {
      obj.tiles = [];
    }
    message.width !== undefined && (obj.width = message.width);
    return obj;
  },

  fromPartial(object: DeepPartial<Map>): Map {
    const message = { ...baseMap } as Map;
    message.tiles = [];
    if (object.tiles !== undefined && object.tiles !== null) {
      for (const e of object.tiles) {
        message.tiles.push(e);
      }
    }
    if (object.width !== undefined && object.width !== null) {
      message.width = object.width;
    } else {
      message.width = 0;
    }
    return message;
  },
};

const baseFaction: object = { players: "" };

export const Faction = {
  encode(
    message: Faction,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.players) {
      writer.uint32(10).string(v!);
    }
    if (message.resources !== undefined) {
      ResourceSet.encode(message.resources, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.population) {
      Populace.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Faction {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFaction } as Faction;
    message.players = [];
    message.population = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.players.push(reader.string());
          break;
        case 2:
          message.resources = ResourceSet.decode(reader, reader.uint32());
          break;
        case 3:
          message.population.push(Populace.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Faction {
    const message = { ...baseFaction } as Faction;
    message.players = [];
    message.population = [];
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(String(e));
      }
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromJSON(object.resources);
    } else {
      message.resources = undefined;
    }
    if (object.population !== undefined && object.population !== null) {
      for (const e of object.population) {
        message.population.push(Populace.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Faction): unknown {
    const obj: any = {};
    if (message.players) {
      obj.players = message.players.map((e) => e);
    } else {
      obj.players = [];
    }
    message.resources !== undefined &&
      (obj.resources = message.resources
        ? ResourceSet.toJSON(message.resources)
        : undefined);
    if (message.population) {
      obj.population = message.population.map((e) =>
        e ? Populace.toJSON(e) : undefined
      );
    } else {
      obj.population = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Faction>): Faction {
    const message = { ...baseFaction } as Faction;
    message.players = [];
    message.population = [];
    if (object.players !== undefined && object.players !== null) {
      for (const e of object.players) {
        message.players.push(e);
      }
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromPartial(object.resources);
    } else {
      message.resources = undefined;
    }
    if (object.population !== undefined && object.population !== null) {
      for (const e of object.population) {
        message.population.push(Populace.fromPartial(e));
      }
    }
    return message;
  },
};

const basePopulace: object = { amount: 0, settlement: 0, used: false };

export const Populace = {
  encode(
    message: Populace,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(8).uint32(message.amount);
    }
    if (message.position !== undefined) {
      Position.encode(message.position, writer.uint32(18).fork()).ldelim();
    }
    if (message.settlement !== 0) {
      writer.uint32(24).int32(message.settlement);
    }
    if (message.used === true) {
      writer.uint32(32).bool(message.used);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Populace {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePopulace } as Populace;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.uint32();
          break;
        case 2:
          message.position = Position.decode(reader, reader.uint32());
          break;
        case 3:
          message.settlement = reader.int32() as any;
          break;
        case 4:
          message.used = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Populace {
    const message = { ...basePopulace } as Populace;
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = Number(object.amount);
    } else {
      message.amount = 0;
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Position.fromJSON(object.position);
    } else {
      message.position = undefined;
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = settlementFromJSON(object.settlement);
    } else {
      message.settlement = 0;
    }
    if (object.used !== undefined && object.used !== null) {
      message.used = Boolean(object.used);
    } else {
      message.used = false;
    }
    return message;
  },

  toJSON(message: Populace): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.position !== undefined &&
      (obj.position = message.position
        ? Position.toJSON(message.position)
        : undefined);
    message.settlement !== undefined &&
      (obj.settlement = settlementToJSON(message.settlement));
    message.used !== undefined && (obj.used = message.used);
    return obj;
  },

  fromPartial(object: DeepPartial<Populace>): Populace {
    const message = { ...basePopulace } as Populace;
    if (object.amount !== undefined && object.amount !== null) {
      message.amount = object.amount;
    } else {
      message.amount = 0;
    }
    if (object.position !== undefined && object.position !== null) {
      message.position = Position.fromPartial(object.position);
    } else {
      message.position = undefined;
    }
    if (object.settlement !== undefined && object.settlement !== null) {
      message.settlement = object.settlement;
    } else {
      message.settlement = 0;
    }
    if (object.used !== undefined && object.used !== null) {
      message.used = object.used;
    } else {
      message.used = false;
    }
    return message;
  },
};

const basePosition: object = { x: 0, y: 0 };

export const Position = {
  encode(
    message: Position,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.x !== 0) {
      writer.uint32(24).uint32(message.x);
    }
    if (message.y !== 0) {
      writer.uint32(32).uint32(message.y);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Position {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePosition } as Position;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.x = reader.uint32();
          break;
        case 4:
          message.y = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Position {
    const message = { ...basePosition } as Position;
    if (object.x !== undefined && object.x !== null) {
      message.x = Number(object.x);
    } else {
      message.x = 0;
    }
    if (object.y !== undefined && object.y !== null) {
      message.y = Number(object.y);
    } else {
      message.y = 0;
    }
    return message;
  },

  toJSON(message: Position): unknown {
    const obj: any = {};
    message.x !== undefined && (obj.x = message.x);
    message.y !== undefined && (obj.y = message.y);
    return obj;
  },

  fromPartial(object: DeepPartial<Position>): Position {
    const message = { ...basePosition } as Position;
    if (object.x !== undefined && object.x !== null) {
      message.x = object.x;
    } else {
      message.x = 0;
    }
    if (object.y !== undefined && object.y !== null) {
      message.y = object.y;
    } else {
      message.y = 0;
    }
    return message;
  },
};

const baseResourceSet: object = {
  food: 0,
  stone: 0,
  wood: 0,
  population: 0,
  tech: 0,
};

export const ResourceSet = {
  encode(
    message: ResourceSet,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.food !== 0) {
      writer.uint32(8).uint32(message.food);
    }
    if (message.stone !== 0) {
      writer.uint32(16).uint32(message.stone);
    }
    if (message.wood !== 0) {
      writer.uint32(24).uint32(message.wood);
    }
    if (message.population !== 0) {
      writer.uint32(32).uint32(message.population);
    }
    if (message.tech !== 0) {
      writer.uint32(40).uint32(message.tech);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ResourceSet {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseResourceSet } as ResourceSet;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.food = reader.uint32();
          break;
        case 2:
          message.stone = reader.uint32();
          break;
        case 3:
          message.wood = reader.uint32();
          break;
        case 4:
          message.population = reader.uint32();
          break;
        case 5:
          message.tech = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ResourceSet {
    const message = { ...baseResourceSet } as ResourceSet;
    if (object.food !== undefined && object.food !== null) {
      message.food = Number(object.food);
    } else {
      message.food = 0;
    }
    if (object.stone !== undefined && object.stone !== null) {
      message.stone = Number(object.stone);
    } else {
      message.stone = 0;
    }
    if (object.wood !== undefined && object.wood !== null) {
      message.wood = Number(object.wood);
    } else {
      message.wood = 0;
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = Number(object.population);
    } else {
      message.population = 0;
    }
    if (object.tech !== undefined && object.tech !== null) {
      message.tech = Number(object.tech);
    } else {
      message.tech = 0;
    }
    return message;
  },

  toJSON(message: ResourceSet): unknown {
    const obj: any = {};
    message.food !== undefined && (obj.food = message.food);
    message.stone !== undefined && (obj.stone = message.stone);
    message.wood !== undefined && (obj.wood = message.wood);
    message.population !== undefined && (obj.population = message.population);
    message.tech !== undefined && (obj.tech = message.tech);
    return obj;
  },

  fromPartial(object: DeepPartial<ResourceSet>): ResourceSet {
    const message = { ...baseResourceSet } as ResourceSet;
    if (object.food !== undefined && object.food !== null) {
      message.food = object.food;
    } else {
      message.food = 0;
    }
    if (object.stone !== undefined && object.stone !== null) {
      message.stone = object.stone;
    } else {
      message.stone = 0;
    }
    if (object.wood !== undefined && object.wood !== null) {
      message.wood = object.wood;
    } else {
      message.wood = 0;
    }
    if (object.population !== undefined && object.population !== null) {
      message.population = object.population;
    } else {
      message.population = 0;
    }
    if (object.tech !== undefined && object.tech !== null) {
      message.tech = object.tech;
    } else {
      message.tech = 0;
    }
    return message;
  },
};

const baseTerritory: object = { faction: 0, populace: 0 };

export const Territory = {
  encode(
    message: Territory,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.faction !== 0) {
      writer.uint32(8).uint32(message.faction);
    }
    if (message.populace !== 0) {
      writer.uint32(16).uint32(message.populace);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Territory {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTerritory } as Territory;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.faction = reader.uint32();
          break;
        case 2:
          message.populace = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Territory {
    const message = { ...baseTerritory } as Territory;
    if (object.faction !== undefined && object.faction !== null) {
      message.faction = Number(object.faction);
    } else {
      message.faction = 0;
    }
    if (object.populace !== undefined && object.populace !== null) {
      message.populace = Number(object.populace);
    } else {
      message.populace = 0;
    }
    return message;
  },

  toJSON(message: Territory): unknown {
    const obj: any = {};
    message.faction !== undefined && (obj.faction = message.faction);
    message.populace !== undefined && (obj.populace = message.populace);
    return obj;
  },

  fromPartial(object: DeepPartial<Territory>): Territory {
    const message = { ...baseTerritory } as Territory;
    if (object.faction !== undefined && object.faction !== null) {
      message.faction = object.faction;
    } else {
      message.faction = 0;
    }
    if (object.populace !== undefined && object.populace !== null) {
      message.populace = object.populace;
    } else {
      message.populace = 0;
    }
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined
  | Long;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
