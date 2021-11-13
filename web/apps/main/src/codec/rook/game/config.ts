/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { ResourceSet } from "../../rook/game/game";

export const protobufPackage = "rook.game";

export interface Config {
  initial?: InitializationConfig;
  map?: MapConfig;
}

export interface MapConfig {
  width: number;
  height: number;
  seed: Long;
  mountainsDensity: number;
  forestDensity: number;
  lakeDensity: number;
  plainsDensity: number;
}

export interface InitializationConfig {
  teams: number;
  resources?: ResourceSet;
}

export interface Params {
  productionRate: ResourceSet[];
  constructionCost: ResourceSet[];
}

const baseConfig: object = {};

export const Config = {
  encode(
    message: Config,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.initial !== undefined) {
      InitializationConfig.encode(
        message.initial,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.map !== undefined) {
      MapConfig.encode(message.map, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Config {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseConfig } as Config;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.initial = InitializationConfig.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.map = MapConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Config {
    const message = { ...baseConfig } as Config;
    if (object.initial !== undefined && object.initial !== null) {
      message.initial = InitializationConfig.fromJSON(object.initial);
    } else {
      message.initial = undefined;
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = MapConfig.fromJSON(object.map);
    } else {
      message.map = undefined;
    }
    return message;
  },

  toJSON(message: Config): unknown {
    const obj: any = {};
    message.initial !== undefined &&
      (obj.initial = message.initial
        ? InitializationConfig.toJSON(message.initial)
        : undefined);
    message.map !== undefined &&
      (obj.map = message.map ? MapConfig.toJSON(message.map) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Config>): Config {
    const message = { ...baseConfig } as Config;
    if (object.initial !== undefined && object.initial !== null) {
      message.initial = InitializationConfig.fromPartial(object.initial);
    } else {
      message.initial = undefined;
    }
    if (object.map !== undefined && object.map !== null) {
      message.map = MapConfig.fromPartial(object.map);
    } else {
      message.map = undefined;
    }
    return message;
  },
};

const baseMapConfig: object = {
  width: 0,
  height: 0,
  seed: Long.ZERO,
  mountainsDensity: 0,
  forestDensity: 0,
  lakeDensity: 0,
  plainsDensity: 0,
};

export const MapConfig = {
  encode(
    message: MapConfig,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.width !== 0) {
      writer.uint32(8).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint32(message.height);
    }
    if (!message.seed.isZero()) {
      writer.uint32(24).int64(message.seed);
    }
    if (message.mountainsDensity !== 0) {
      writer.uint32(32).uint32(message.mountainsDensity);
    }
    if (message.forestDensity !== 0) {
      writer.uint32(40).uint32(message.forestDensity);
    }
    if (message.lakeDensity !== 0) {
      writer.uint32(48).uint32(message.lakeDensity);
    }
    if (message.plainsDensity !== 0) {
      writer.uint32(56).uint32(message.plainsDensity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMapConfig } as MapConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.width = reader.uint32();
          break;
        case 2:
          message.height = reader.uint32();
          break;
        case 3:
          message.seed = reader.int64() as Long;
          break;
        case 4:
          message.mountainsDensity = reader.uint32();
          break;
        case 5:
          message.forestDensity = reader.uint32();
          break;
        case 6:
          message.lakeDensity = reader.uint32();
          break;
        case 7:
          message.plainsDensity = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MapConfig {
    const message = { ...baseMapConfig } as MapConfig;
    if (object.width !== undefined && object.width !== null) {
      message.width = Number(object.width);
    } else {
      message.width = 0;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = Number(object.height);
    } else {
      message.height = 0;
    }
    if (object.seed !== undefined && object.seed !== null) {
      message.seed = Long.fromString(object.seed);
    } else {
      message.seed = Long.ZERO;
    }
    if (
      object.mountainsDensity !== undefined &&
      object.mountainsDensity !== null
    ) {
      message.mountainsDensity = Number(object.mountainsDensity);
    } else {
      message.mountainsDensity = 0;
    }
    if (object.forestDensity !== undefined && object.forestDensity !== null) {
      message.forestDensity = Number(object.forestDensity);
    } else {
      message.forestDensity = 0;
    }
    if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
      message.lakeDensity = Number(object.lakeDensity);
    } else {
      message.lakeDensity = 0;
    }
    if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
      message.plainsDensity = Number(object.plainsDensity);
    } else {
      message.plainsDensity = 0;
    }
    return message;
  },

  toJSON(message: MapConfig): unknown {
    const obj: any = {};
    message.width !== undefined && (obj.width = message.width);
    message.height !== undefined && (obj.height = message.height);
    message.seed !== undefined &&
      (obj.seed = (message.seed || Long.ZERO).toString());
    message.mountainsDensity !== undefined &&
      (obj.mountainsDensity = message.mountainsDensity);
    message.forestDensity !== undefined &&
      (obj.forestDensity = message.forestDensity);
    message.lakeDensity !== undefined &&
      (obj.lakeDensity = message.lakeDensity);
    message.plainsDensity !== undefined &&
      (obj.plainsDensity = message.plainsDensity);
    return obj;
  },

  fromPartial(object: DeepPartial<MapConfig>): MapConfig {
    const message = { ...baseMapConfig } as MapConfig;
    if (object.width !== undefined && object.width !== null) {
      message.width = object.width;
    } else {
      message.width = 0;
    }
    if (object.height !== undefined && object.height !== null) {
      message.height = object.height;
    } else {
      message.height = 0;
    }
    if (object.seed !== undefined && object.seed !== null) {
      message.seed = object.seed as Long;
    } else {
      message.seed = Long.ZERO;
    }
    if (
      object.mountainsDensity !== undefined &&
      object.mountainsDensity !== null
    ) {
      message.mountainsDensity = object.mountainsDensity;
    } else {
      message.mountainsDensity = 0;
    }
    if (object.forestDensity !== undefined && object.forestDensity !== null) {
      message.forestDensity = object.forestDensity;
    } else {
      message.forestDensity = 0;
    }
    if (object.lakeDensity !== undefined && object.lakeDensity !== null) {
      message.lakeDensity = object.lakeDensity;
    } else {
      message.lakeDensity = 0;
    }
    if (object.plainsDensity !== undefined && object.plainsDensity !== null) {
      message.plainsDensity = object.plainsDensity;
    } else {
      message.plainsDensity = 0;
    }
    return message;
  },
};

const baseInitializationConfig: object = { teams: 0 };

export const InitializationConfig = {
  encode(
    message: InitializationConfig,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.teams !== 0) {
      writer.uint32(8).uint32(message.teams);
    }
    if (message.resources !== undefined) {
      ResourceSet.encode(message.resources, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): InitializationConfig {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseInitializationConfig } as InitializationConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.teams = reader.uint32();
          break;
        case 2:
          message.resources = ResourceSet.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InitializationConfig {
    const message = { ...baseInitializationConfig } as InitializationConfig;
    if (object.teams !== undefined && object.teams !== null) {
      message.teams = Number(object.teams);
    } else {
      message.teams = 0;
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromJSON(object.resources);
    } else {
      message.resources = undefined;
    }
    return message;
  },

  toJSON(message: InitializationConfig): unknown {
    const obj: any = {};
    message.teams !== undefined && (obj.teams = message.teams);
    message.resources !== undefined &&
      (obj.resources = message.resources
        ? ResourceSet.toJSON(message.resources)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<InitializationConfig>): InitializationConfig {
    const message = { ...baseInitializationConfig } as InitializationConfig;
    if (object.teams !== undefined && object.teams !== null) {
      message.teams = object.teams;
    } else {
      message.teams = 0;
    }
    if (object.resources !== undefined && object.resources !== null) {
      message.resources = ResourceSet.fromPartial(object.resources);
    } else {
      message.resources = undefined;
    }
    return message;
  },
};

const baseParams: object = {};

export const Params = {
  encode(
    message: Params,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.productionRate) {
      ResourceSet.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.constructionCost) {
      ResourceSet.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseParams } as Params;
    message.productionRate = [];
    message.constructionCost = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productionRate.push(
            ResourceSet.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.constructionCost.push(
            ResourceSet.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    const message = { ...baseParams } as Params;
    message.productionRate = [];
    message.constructionCost = [];
    if (object.productionRate !== undefined && object.productionRate !== null) {
      for (const e of object.productionRate) {
        message.productionRate.push(ResourceSet.fromJSON(e));
      }
    }
    if (
      object.constructionCost !== undefined &&
      object.constructionCost !== null
    ) {
      for (const e of object.constructionCost) {
        message.constructionCost.push(ResourceSet.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.productionRate) {
      obj.productionRate = message.productionRate.map((e) =>
        e ? ResourceSet.toJSON(e) : undefined
      );
    } else {
      obj.productionRate = [];
    }
    if (message.constructionCost) {
      obj.constructionCost = message.constructionCost.map((e) =>
        e ? ResourceSet.toJSON(e) : undefined
      );
    } else {
      obj.constructionCost = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Params>): Params {
    const message = { ...baseParams } as Params;
    message.productionRate = [];
    message.constructionCost = [];
    if (object.productionRate !== undefined && object.productionRate !== null) {
      for (const e of object.productionRate) {
        message.productionRate.push(ResourceSet.fromPartial(e));
      }
    }
    if (
      object.constructionCost !== undefined &&
      object.constructionCost !== null
    ) {
      for (const e of object.constructionCost) {
        message.constructionCost.push(ResourceSet.fromPartial(e));
      }
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
