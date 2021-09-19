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
export declare type MatchmakerMsgJoinResponse = object;
export declare type MatchmakerMsgLeaveResponse = object;
export declare type MatchmakerMsgRemoveModeResponse = object;
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
 * @title rook/matchmaker/genesis.proto
 * @version version not set
 */
export declare class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    /**
     * No description
     *
     * @tags Query
     * @name QueryInvitations
     * @summary Invitations lists all the rooms that a player is invited to
     * @request GET:/matchmaker/invitations/{player}
     */
    queryInvitations: (player: string, params?: RequestParams) => Promise<HttpResponse<MatchmakerQueryGetInvitationsResponse, RpcStatus>>;
    /**
     * No description
     *
     * @tags Query
     * @name QueryModes
     * @summary Modes lists all the public available modes
     * @request GET:/matchmaker/modes
     */
    queryModes: (params?: RequestParams) => Promise<HttpResponse<MatchmakerQueryGetModesResponse, RpcStatus>>;
    /**
     * No description
     *
     * @tags Query
     * @name QueryParams
     * @summary Params lists the current matchmaker params
     * @request GET:/matchmaker/params
     */
    queryParams: (params?: RequestParams) => Promise<HttpResponse<MatchmakerQueryGetParamsResponse, RpcStatus>>;
    /**
     * No description
     *
     * @tags Query
     * @name QueryRoom
     * @summary Room returns the current state of a specific room
     * @request GET:/matchmaker/room/{id}
     */
    queryRoom: (id: string, params?: RequestParams) => Promise<HttpResponse<MatchmakerQueryGetRoomResponse, RpcStatus>>;
}
export {};
