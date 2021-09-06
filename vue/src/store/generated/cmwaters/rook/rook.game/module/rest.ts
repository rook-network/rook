/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GameConfig {
  initial?: GameInitializationConfig;
  map?: GameMapConfig;
}

export enum GameDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  UP = "UP",
  DOWN = "DOWN",
}

export interface GameFaction {
  player?: string;
  resources?: GameResourceSet;
  population?: GamePopulace[];
}

export interface GameInitializationConfig {
  /** @format int64 */
  teams?: number;
  resources?: GameResourceSet;
}

export enum GameLandscape {
  UNKNOWN = "UNKNOWN",
  PLAINS = "PLAINS",
  FOREST = "FOREST",
  MOUNTAINS = "MOUNTAINS",
  LAKE = "LAKE",
}

export interface GameMap {
  tiles?: GameLandscape[];

  /** @format int64 */
  width?: number;
}

export interface GameMapConfig {
  /** @format int64 */
  width?: number;

  /** @format int64 */
  height?: number;

  /** @format int64 */
  seed?: string;

  /** @format int64 */
  mountainsDensity?: number;

  /** @format int64 */
  forestDensity?: number;

  /** @format int64 */
  lakeDensity?: number;

  /** @format int64 */
  plainsDensity?: number;
}

export type GameMsgBuildResponse = object;

export interface GameMsgChangeParamsResponse {
  /** @format int64 */
  version?: number;
}

export interface GameMsgCreateResponse {
  /** @format uint64 */
  gameId?: string;
}

export type GameMsgMoveResponse = object;

export interface GameOverview {
  map?: GameMap;

  /** @format int64 */
  paramVersion?: number;
}

export interface GameParams {
  productionRate?: GameResourceSet[];
  constructionCost?: GameResourceSet[];
}

export interface GamePopulace {
  /** @format int64 */
  amount?: number;
  position?: GamePosition;
  settlement?: GameSettlement;
}

export interface GamePosition {
  /** @format int64 */
  x?: number;

  /** @format int64 */
  y?: number;
}

export interface GameQueryGetGameResponse {
  overview?: GameOverview;

  /** @format uint64 */
  id?: string;
}

export interface GameQueryGetGameStateResponse {
  state?: GameState;
}

export interface GameQueryGetParamsResponse {
  params?: GameParams;

  /** @format int64 */
  version?: number;
}

export interface GameResourceSet {
  /** @format int64 */
  food?: number;

  /** @format int64 */
  stone?: number;

  /** @format int64 */
  wood?: number;

  /** @format int64 */
  population?: number;
}

export enum GameSettlement {
  NONE = "NONE",
  TOWN = "TOWN",
  CITY = "CITY",
  CAPITAL = "CAPITAL",
  LUMBERMILL = "LUMBERMILL",
  QUARRY = "QUARRY",
  FARM = "FARM",
  ROOK = "ROOK",
}

export interface GameState {
  players?: GameFaction[];
  gaia?: GamePopulace[];

  /** @format uint64 */
  step?: string;
}

export interface ProtobufAny {
  typeUrl?: string;

  /** @format byte */
  value?: string;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: keyof Omit<Body, "body" | "bodyUsed">;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType) => RequestParams | void;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType = null as any;
  private securityWorker: null | ApiConfig<SecurityDataType>["securityWorker"] = null;
  private abortControllers = new Map<CancelToken, AbortController>();

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType) => {
    this.securityData = data;
  };

  private addQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];

    return (
      encodeURIComponent(key) +
      "=" +
      encodeURIComponent(Array.isArray(value) ? value.join(",") : typeof value === "number" ? value : `${value}`)
    );
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) =>
        typeof query[key] === "object" && !Array.isArray(query[key])
          ? this.toQueryString(query[key] as QueryParamsType)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((data, key) => {
        data.append(key, input[key]);
        return data;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  private mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format = "json",
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams = (secure && this.securityWorker && this.securityWorker(this.securityData)) || {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];

    return fetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : void 0,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = (null as unknown) as T;
      r.error = (null as unknown) as E;

      const data = await response[format]()
        .then((data) => {
          if (r.ok) {
            r.data = data;
          } else {
            r.error = data;
          }
          return r;
        })
        .catch((e) => {
          r.error = e;
          return r;
        });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title rook/game/game.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryGame
   * @request GET:/rook/game/{id}
   */
  queryGame = (id: string, params: RequestParams = {}) =>
    this.request<GameQueryGetGameResponse, RpcStatus>({
      path: `/rook/game/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryGameState
   * @summary Queries a game state by id.
   * @request GET:/rook/game_state/{id}
   */
  queryGameState = (id: string, params: RequestParams = {}) =>
    this.request<GameQueryGetGameStateResponse, RpcStatus>({
      path: `/rook/game_state/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @request GET:/rook/params/{version}
   */
  queryParams = (version: number, params: RequestParams = {}) =>
    this.request<GameQueryGetParamsResponse, RpcStatus>({
      path: `/rook/params/${version}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
