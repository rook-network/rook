export interface GameConfig {
    initial?: GameInitializationConfig;
    map?: GameMapConfig;
}
export declare enum GameDirection {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    UP = "UP",
    DOWN = "DOWN"
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
export declare enum GameLandscape {
    UNKNOWN = "UNKNOWN",
    PLAINS = "PLAINS",
    FOREST = "FOREST",
    MOUNTAINS = "MOUNTAINS",
    LAKE = "LAKE"
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
export declare type GameMsgBuildResponse = object;
export interface GameMsgChangeParamsResponse {
    /** @format int64 */
    version?: number;
}
export interface GameMsgCreateResponse {
    /** @format uint64 */
    gameId?: string;
}
export declare type GameMsgMoveResponse = object;
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
    players?: string[];
    overview?: GameOverview;
}
export interface GameQueryGetGameStateResponse {
    gameState?: GameState;
}
export interface GameQueryGetParamsResponse {
    params?: GameParams;
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
export declare enum GameSettlement {
    NONE = "NONE",
    TOWN = "TOWN",
    CITY = "CITY",
    CAPITAL = "CAPITAL",
    LUMBERMILL = "LUMBERMILL",
    QUARRY = "QUARRY",
    FARM = "FARM",
    ROOK = "ROOK"
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
export declare type QueryParamsType = Record<string | number, any>;
export declare type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;
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
export declare type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;
export interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
    securityWorker?: (securityData: SecurityDataType) => RequestParams | void;
}
export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}
declare type CancelToken = Symbol | string | number;
export declare enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded"
}
export declare class HttpClient<SecurityDataType = unknown> {
    baseUrl: string;
    private securityData;
    private securityWorker;
    private abortControllers;
    private baseApiParams;
    constructor(apiConfig?: ApiConfig<SecurityDataType>);
    setSecurityData: (data: SecurityDataType) => void;
    private addQueryParam;
    protected toQueryString(rawQuery?: QueryParamsType): string;
    protected addQueryParams(rawQuery?: QueryParamsType): string;
    private contentFormatters;
    private mergeRequestParams;
    private createAbortSignal;
    abortRequest: (cancelToken: CancelToken) => void;
    request: <T = any, E = any>({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params }: FullRequestParams) => Promise<HttpResponse<T, E>>;
}
/**
 * @title rook/game/game.proto
 * @version version not set
 */
export declare class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    /**
     * No description
     *
     * @tags Query
     * @name QueryGame
     * @request GET:/rook/game/{id}
     */
    queryGame: (id: string, params?: RequestParams) => Promise<HttpResponse<GameQueryGetGameResponse, RpcStatus>>;
    /**
     * No description
     *
     * @tags Query
     * @name QueryGameState
     * @summary Queries a game state by id.
     * @request GET:/rook/game_state/{id}
     */
    queryGameState: (id: string, params?: RequestParams) => Promise<HttpResponse<GameQueryGetGameStateResponse, RpcStatus>>;
    /**
     * No description
     *
     * @tags Query
     * @name QueryParams
     * @request GET:/rook/params/{version}
     */
    queryParams: (version: number, params?: RequestParams) => Promise<HttpResponse<GameQueryGetParamsResponse, RpcStatus>>;
}
export {};
