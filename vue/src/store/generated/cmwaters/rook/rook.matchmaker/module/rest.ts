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

export interface GameInitializationConfig {
  /** @format int64 */
  teams?: number;
  resources?: GameResourceSet;
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

export interface MatchmakerMode {
  config?: GameConfig;

  /** @format int64 */
  quorum?: number;

  /** @format int64 */
  capacity?: number;
}

export interface MatchmakerMsgAddModeResponse {
  /** @format int64 */
  id?: number;
}

export interface MatchmakerMsgFindResponse {
  /** @format uint64 */
  roomId?: string;
}

export interface MatchmakerMsgHostResponse {
  /** @format uint64 */
  roomId?: string;
}

export type MatchmakerMsgJoinResponse = object;

export type MatchmakerMsgLeaveResponse = object;

export type MatchmakerMsgRemoveModeResponse = object;

export interface MatchmakerQueryGetInvitationsResponse {
  rooms?: Record<string, MatchmakerRoom>;
}

export interface MatchmakerQueryGetModesResponse {
  modes?: Record<string, MatchmakerMode>;
}

export interface MatchmakerQueryGetParamsResponse {
  params?: RookmatchmakerParams;
}

export interface MatchmakerQueryGetRoomResponse {
  room?: MatchmakerRoom;
}

export interface MatchmakerRoom {
  config?: GameConfig;
  players?: string[];
  pending?: string[];
  public?: boolean;

  /** @format int64 */
  quorum?: number;

  /** @format int64 */
  capacity?: number;

  /** @format int64 */
  modeId?: number;

  /** @format date-time */
  created?: string;

  /**
   * when quorum is reached and we are locked in to starting the game.
   * The prestart_wait_period gives a bufer for more people to join if they
   * want.
   * @format date-time
   */
  ready?: string;

  /** @format date-time */
  scheduled?: string;
}

export interface ProtobufAny {
  "@type"?: string;
}

export interface RookmatchmakerParams {
  roomLifespan?: string;
  prestartWaitPeriod?: string;
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
 * @title rook/matchmaker/genesis.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name QueryInvitations
   * @summary Invitations lists all the rooms that a player is invited to
   * @request GET:/matchmaker/invitations/{player}
   */
  queryInvitations = (player: string, params: RequestParams = {}) =>
    this.request<MatchmakerQueryGetInvitationsResponse, RpcStatus>({
      path: `/matchmaker/invitations/${player}`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryModes
   * @summary Modes lists all the public available modes
   * @request GET:/matchmaker/modes
   */
  queryModes = (params: RequestParams = {}) =>
    this.request<MatchmakerQueryGetModesResponse, RpcStatus>({
      path: `/matchmaker/modes`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryParams
   * @summary Params lists the current matchmaker params
   * @request GET:/matchmaker/params
   */
  queryParams = (params: RequestParams = {}) =>
    this.request<MatchmakerQueryGetParamsResponse, RpcStatus>({
      path: `/matchmaker/params`,
      method: "GET",
      format: "json",
      ...params,
    });

  /**
   * No description
   *
   * @tags Query
   * @name QueryRoom
   * @summary Room returns the current state of a specific room
   * @request GET:/matchmaker/room/{id}
   */
  queryRoom = (id: string, params: RequestParams = {}) =>
    this.request<MatchmakerQueryGetRoomResponse, RpcStatus>({
      path: `/matchmaker/room/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
