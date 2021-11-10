import { 
    MsgFind, MsgHost, MsgJoin, MsgLeave, MsgAddMode, MsgRemoveMode, Msg as IMatchmakerMsgClient, 
    MsgFindResponse, MsgHostResponse, MsgJoinResponse, MsgLeaveResponse, MsgAddModeResponse, MsgRemoveModeResponse
} from '../../codec/rook/matchmaker/tx'
import { SocketWrapper, SocketWrapperMessageEvent, SocketWrapperErrorEvent } from '@cosmjs/socket'
import { Event } from '@cosmjs/tendermint-rpc'
import { QueryClientImpl as MatchmakerQueryClient, QueryGetRoomResponse} from '../../codec/rook/matchmaker/query'
import { SigningStargateClient, QueryClient, createProtobufRpcClient, isBroadcastTxSuccess, BroadcastTxSuccess } from "@cosmjs/stargate"
import { Registry } from '@cosmjs/stargate/node_modules/@cosmjs/proto-signing'
import Long from 'long'
import { defaultFee } from './types'
import _m0 from "protobufjs/minimal";
import { Room } from '../../codec/rook/matchmaker/matchmaker'
import config from '../../config'

export const typeMsgFind = "/rook.matchmaker.MsgFind"
export const typeMsgHost = "/rook.matchmaker.MsgHost"
export const typeMsgJoin = "/rook.matchmaker.MsgJoin"
export const typeMsgLeave = "/rook.matchmaker.MsgLeave"
export const typeMsgAddMode = "/rook.matchmaker.MsgAddMode"
export const typeMsgRemoveMode = "/rook.matchmaker.MsgRemoveMode" 

export const eventRoomUpdated = "rook.matchmaker.EventRoomUpdated"

export function registerMatchmakerMsgs(registry: Registry) {
    registry.register(typeMsgFind, MsgFind)
    registry.register(typeMsgHost, MsgHost)
    registry.register(typeMsgJoin, MsgJoin)
    registry.register(typeMsgLeave, MsgLeave)
    registry.register(typeMsgAddMode, MsgAddMode)
    registry.register(typeMsgRemoveMode, MsgRemoveMode)
}

export interface MatchmakerSocket {
    subscribeToRoom(id: number, onUpdate: (room: Room) => void): void,
    unsubscribeToRoom(id: number): void
}

export class MatchmakerProvider {
    public query: MatchmakerQueryClient
    public tx: IMatchmakerMsgClient
    private socket: SocketWrapper

    // we can only subscribe to a single room at a time
    private onUpdate?: (room: Room) => void
    private onGameStart?: (id: number) => void
    private room?: Room

    constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new MatchmakerQueryClient(protoRpcClient)
        // FIXME: The msg client sends a query instead of broadcasting a tx
        // this.tx = new MsgClientImpl(protoRpcClient)
        this.tx = new MatchmakerMsgClient(client, address)
        this.socket = new SocketWrapper(
            config.wsEndpoint, 
            (event: SocketWrapperMessageEvent) => { 
                const parsedEvent = JSON.parse(event.data)
                console.log(parsedEvent)
                if (parsedEvent.query === undefined) {
                    return
                }
                if (parsedEvent.query.contains("joined_room")) {
                    this.parseJoinedRoomEvent(parsedEvent)
                } else if (parsedEvent.query.contains("game_started")) {
                    this.parseGameStartedEvent(parsedEvent)
                }
            },
            (event: SocketWrapperErrorEvent) => { console.error(event)}
        )
        this.socket.connect()
    }

    subscribeToRoom(id: Long, onUpdate: (room: Room) => void): void {
        const subscribeMsg = {
            jsonrpc: "2.0",
            method: "subscribe",
            id: "0",
            params: {
                query: `event_room_updated.room_id='${id}'`
            }
        } 
        this.onUpdate = onUpdate
        this.query.Room({id: id}).then((resp: QueryGetRoomResponse) => {
            if (this.onUpdate && resp.room) {
                console.log("updating room")
                this.onUpdate(resp.room)
                this.room = resp.room
                this.socket.send(JSON.stringify(subscribeMsg))
            } else {
                throw new Error("failed to subscribe to room events")
            }
        })
    }

    unsubscribeToRoom(id: Long): void {
        const unsubscribeMsg = {
            jsonrpc: "2.0",
            method: "unsubscribe",
            id: "0"
        }
        this.socket.send(JSON.stringify(unsubscribeMsg))
        this.onUpdate = undefined
    }

    subscribeToGameStart(player: string, onGameStart: (id: number) => void): void {
        const subscribeMsg = {
            jsonrpc: "2.0",
            method: "subscribe",
            id: "0",
            params: {
                query: `event_new_game.players='${player}'`
            }
        }
        this.socket.send(JSON.stringify(subscribeMsg))
        this.onGameStart = onGameStart
    }

    unsubscribeToGameStart(): void {
        return
    }

    private parseJoinedRoomEvent(event: any): void {
        if (!this.room || !this.onUpdate) {
            console.error("received room event but subscription not set")
            return
        } 
        if (!event.result.events) {
            console.log("no events")
            return
        }
        if (!event.result.events["joined_room.player"]) {
            console.log("no joined room")
            return
        }

        if (event.result.events["joined_room.player"]) {
            this.room.players.push(event.result.events["joined_room.player"][0])
            this.onUpdate(this.room)
        }
    }

    private parseGameStartedEvent(event: any): void {
        if (!this.onGameStart) {
            console.error("received game started event but subscription not sent")
        }
        if (!event.result.events) {
            console.log("no events")
            return
        }
        if (!event.result.events["joined_room.player"]) {
            console.log("no joined room")
            return
        }

        // if (event.result.events["joined_room.player"]) {
        //     this.room.players.push(event.result.events["joined_room.player"][0])
        //     this.onUpdate(this.room)
        // }
    }


}

export class MatchmakerMsgClient implements IMatchmakerMsgClient {
    private client: SigningStargateClient
    private address: string
    private updateHeight?: (height: number) => void

    constructor(client: SigningStargateClient, address: string, updateHeight?: (height:number) => void) {
        this.client = client
        this.address = address
        this.updateHeight = updateHeight
    }

    private async send(request: any, typeUrl: string): Promise<BroadcastTxSuccess> {
        const resp = await this.client.signAndBroadcast(
            this.address,
            [{
                typeUrl: typeUrl,
                value: request
            }], 
            defaultFee 
        )
        if (this.updateHeight)
            this.updateHeight(resp.height)

        if (!isBroadcastTxSuccess(resp))
            throw new Error(`Transaction failed with code (${resp.code}): ${resp.rawLog}`)

        return resp
    }

    async Host(request: MsgHost): Promise<MsgHostResponse> {
        const resp = await this.send(request, typeMsgHost)
        
        // FIXME: resp.data is always nil when we should be getting the response from
        // th msg server. Instead we parse the events and build the response from them.
        if (resp.data !== undefined) {
            return MsgHostResponse.decode(new _m0.Reader(resp.data[0]!.data))
        }

        if (resp.rawLog !== undefined) {
            const events = JSON.parse(resp.rawLog)[0].events as Event[]
            for (const event of events) {
                if (event.type === eventRoomUpdated) {
                    return {
                        roomId: Long.fromString(event.attributes[0].value.toString())
                    } as MsgHostResponse
                }
            }
            throw new Error("no room events were emitted after transaction")
        }
        throw new Error("Unable to parse transaction response: " + JSON.stringify(resp))
    }

    async Join(request: MsgJoin): Promise<MsgJoinResponse> {
        await this.send(request, typeMsgJoin)
        return {}
    }

    async Find(request: MsgFind): Promise<MsgFindResponse> {
        const resp = await this.send(request, typeMsgFind)

        // FIXME: resp.data is always nil when we should be getting the response from
        // th msg server. Instead we parse the events and build the response from them.
        if (resp.data !== undefined) { 
            return MsgFindResponse.decode(new _m0.Reader(resp.data[0]!.data))
        }

        if (resp.rawLog !== undefined) {
            const events = JSON.parse(resp.rawLog)[0].events as Event[]
            console.log(events)
            for (const event of events) {
                if (event.type === eventRoomUpdated) {
                    console.log("room id: " + event.attributes[0].value.toString())
                    return {
                        roomId: Long.fromString(event.attributes[0].value.toString())
                    } as MsgHostResponse
                }
            }
            throw new Error("no room events were emitted after transaction")
        }
        throw new Error("Unable to parse transaction response: " + JSON.stringify(resp))
    }

    async Leave(request: MsgLeave): Promise<MsgLeaveResponse> {
        await this.send(request, typeMsgLeave)
        return {}
    }

    async AddMode(request: MsgAddMode): Promise<MsgAddModeResponse> {
        await this.send(request, typeMsgAddMode)
        // TODO: we should emit an event and parse it correct to have a return value.
        // We will return a hard-coded value for now 
        return { 
            id: 0,
        }
    }

    async RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse> {
        await this.send(request, typeMsgRemoveMode)
        return {}
    }
}