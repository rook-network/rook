import { 
    MsgFind, MsgHost, MsgJoin, MsgLeave, MsgAddMode, MsgRemoveMode, Msg as IMatchmakerMsgClient, 
    MsgFindResponse, MsgHostResponse, MsgJoinResponse, MsgLeaveResponse, MsgAddModeResponse, MsgRemoveModeResponse
} from '../../codec/rook/matchmaker/tx'
import { SocketWrapper, SocketWrapperMessageEvent, SocketWrapperErrorEvent } from '@cosmjs/socket'
import { Event } from '@cosmjs/tendermint-rpc'
import { QueryClientImpl as MatchmakerQueryClient} from '../../codec/rook/matchmaker/query'
import { SigningStargateClient, QueryClient, createProtobufRpcClient, isBroadcastTxSuccess, BroadcastTxSuccess } from "@cosmjs/stargate"
import { Registry } from '@cosmjs/proto-signing'
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

export const eventRoom = "matchmaker.room"

export const attributeRoomID = "room_id"
export const attributeGameID = "game_id"
export const attributePlayerJoined = "player_joined"
export const attributePlayerLeft = "player_left"

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
    private onGameStart?: (id: Long) => void
    private room?: Room
    private roomID?: Long

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
                if (!parsedEvent.result) {
                    return
                }
                this.parseRoomEvent(parsedEvent.result.events)
            },
            (event: SocketWrapperErrorEvent) => { console.error(event)}
        )

        // open websocket connection
        this.socket.connect()
    }

    static register(registry: Registry) {
        registry.register(typeMsgFind, MsgFind)
        registry.register(typeMsgHost, MsgHost)
        registry.register(typeMsgJoin, MsgJoin)
        registry.register(typeMsgLeave, MsgLeave)
        registry.register(typeMsgAddMode, MsgAddMode)
        registry.register(typeMsgRemoveMode, MsgRemoveMode)
    }

    async subscribeToRoom(id: Long, onUpdate: (room: Room) => void, onGameStart: (id: Long) => void): Promise<void> {
        if (this.room !== undefined) {
            throw new Error("already subscribed to room events")
        }

        // fetch current room
        const resp = await this.query.Room({id: id})
        if (!resp.room) {
            throw new Error("failed to subscribe to room events")
        }

        console.log("updating room")
        console.log(resp.room)

        // set up callbacks and fire the first one for the room update
        this.onUpdate = onUpdate
        this.onUpdate(resp.room)
        this.onGameStart = onGameStart
        this.room = resp.room
        this.roomID = id

        // await for the socket to be connected
        // this.socket.connect()
        await this.socket.connected
        // open subscription for room updates
        await this.socket.send(JSON.stringify({
            jsonrpc: "2.0",
            method: "subscribe",
            id: "0",
            params: {
                query: `${eventRoom}.${attributeRoomID}='${id.toString()}'`
            }
        }))
        console.log("subscribed to room " + id)
    }

    async unsubscribeToRoom(id: Long): Promise<void> {
        // unsubscribe (this is perhaps not necessary)
        await this.socket.send(JSON.stringify({
            jsonrpc: "2.0",
            method: "unsubscribe",
            id: "0"
        }))
        // clear callbacks
        this.onUpdate = undefined
        this.onGameStart = undefined
        this.room = undefined

        // disconnect socket
        this.socket.disconnect()
    }

    private parseRoomEvent(events: any): void {
        if (!this.room || !this.onUpdate || !this.roomID  || !this.onGameStart ) {
            console.error("received room event but no subscription set")
            return
        } 
        if (!events) {
            console.error("no events")
            return
        }

        if (!events["matchmaker.room.room_id"]) {
            console.error("no event containing a room ID")
            return
        }

        if (events["matchmaker.room.room_id"][0] !== this.roomID.toString()) {
            console.error("received event update for a room we are not listening to")
            return
        }

        if (events["matchmaker.room.player_joined"]) {
            // NOTE: because the sdk event system sends multiple occurences of the same
            // event we need to check whether the player has already been added to avoid
            // adding the same player twice
            const newPlayer = events["matchmaker.room.player_joined"][0]
            let exists = false
            for (const player of this.room.players) {
                if (player === newPlayer) {
                    exists = true
                }
            }
            if (!exists) {
                this.room.players.push(newPlayer)
                this.onUpdate(this.room)
            }
        }

        if (events["matchmaker.room.player_left"]) {
            const removedPlayer = events["matchmaker.room.player_left"][0] as string
            for (let i = 0; i < this.room.players.length; i++) {
                if (this.room.players[i] === removedPlayer) {
                    this.room.players.splice(i, 1)
                    break
                }
            }
            this.onUpdate(this.room)
        }

        if (events["matchmaker.room.game_id"]) {
            const gameID = Long.fromString(events["matchmaker.room.game_id"][0])
            this.onGameStart(gameID)
        }
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
                if (event.type === eventRoom) {
                    
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
            const event = findFirstEventType(events, eventRoom)
            if (event) {
                const roomIDStr = findValueFromEventKey(event, attributeRoomID)
                console.log("room id: " + roomIDStr)
                if (roomIDStr) {
                    return {
                        roomId: Long.fromString(roomIDStr),
                    } as MsgHostResponse
                }
                throw new Error("could not find " + attributeRoomID + " attribute key.")
            }
            throw new Error("could not find " + eventRoom + " event.")
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
            modeId: 0,
        }
    }

    async RemoveMode(request: MsgRemoveMode): Promise<MsgRemoveModeResponse> {
        await this.send(request, typeMsgRemoveMode)
        return {}
    }
}

function findFirstEventType(events: Event[], type: string): Event | null {
    for (const event of events) {
        if (event.type === type) {
            return event
        }
    }
    return null
}

function findValueFromEventKey(event: Event, key: string): string | null {
    for (const attribute of event.attributes) {
        if (attribute.key.toString() === key) {
            return attribute.value.toString()
            // return parseAttributeString(attribute.value)
        }
    }
    return null
}

function parseAttributeString(input: Uint8Array): string {
    let str = input.toString()
    // slice off the first and last value as they are ""
    str = str.substring(1, input.length - 1)
    return str
}