import { QueryClientImpl as GameQueryClient } from '../../codec/rook/game/query'
import _m0 from "protobufjs/minimal";
import { 
    Msg as IGameMsgClient, MsgCreate, MsgBuild, MsgMove, MsgChangeParams,
    MsgCreateResponse, MsgBuildResponse, MsgMoveResponse, MsgChangeParamsResponse
} from '../../codec/rook/game/tx'
import { SocketWrapper, SocketWrapperMessageEvent, SocketWrapperErrorEvent } from '@cosmjs/socket'
import { Registry, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, QueryClient, createProtobufRpcClient, isBroadcastTxSuccess } from '@cosmjs/stargate'
import { Tendermint34Client, BroadcastTxSyncResponse } from '@cosmjs/tendermint-rpc'
import { MsgExec } from '../../codec/cosmos/authz/v1beta1/tx'
import { typeMsgExec } from './authorization'
import { defaultFee } from './types'
import { Provider } from './root'
import { State, Settlement } from '../../codec/rook/game/game'
import config from '../../config';
import { TxRaw } from '../../codec/cosmos/tx/v1beta1/tx';

export const typeMsgCreate = "/rook.game.MsgCreate"
export const typeMsgBuild = "/rook.game.MsgBuild"
export const typeMsgMove = "/rook.game.MsgMove"
export const typeMsgChangeParams = "/rook.game.MsgChangeParams"

export const eventGame = "game.game"
export const eventNewBlock = "tendermint/event/NewBlock"

export const attributeGameID = "game_id"
export const attributeState = "state"

export class GameProvider {
    public readonly playerAddress: string
    public readonly mainAddress: string
    public query: GameQueryClient
    public tx: IGameMsgClient
    
    private tmClient: Tendermint34Client
    private socket: SocketWrapper
    private onUpdate?: (state: State) => void
    private onEnd?: (winners: string[]) => void

    public static async connect(provider: Provider) {
        const mainAddress = provider.getAddress()
        const serialized = window.localStorage.getItem(mainAddress)
        let wallet: DirectSecp256k1HdWallet
        if (serialized === null) {
            wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: config.bech32prefix })
            window.localStorage.setItem(mainAddress, await wallet.serialize(mainAddress))
        } else {
            wallet = await DirectSecp256k1HdWallet.deserialize(serialized, mainAddress)
        }

        const registry = new Registry()
        GameProvider.register(registry)

        const client = await SigningStargateClient.connectWithSigner(
            config.rpcEndpoint,
            wallet,
            { registry: registry }
        )

        const accounts = await wallet.getAccounts()
        const address = accounts[0].address
        console.log("connected with " + address)

        const authorized = await provider.authz.checkPlayerAuthorized(address)

        if (!authorized) {
            await provider.authz.authorizePlayerAccount(address)
        }

        const tmClient = await Tendermint34Client.connect(config.rpcEndpoint)

        return new GameProvider(provider.getQuerier(), client, tmClient, address, mainAddress)
    }

    constructor(querier: QueryClient, client: SigningStargateClient, tmClient: Tendermint34Client,
        address: string, mainAddress: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new GameQueryClient(protoRpcClient)
        this.tx = new GameMsgClient(client, tmClient, address)
        this.playerAddress = address
        this.mainAddress = mainAddress
        this.tmClient = tmClient
        this.socket = new SocketWrapper(
            config.wsEndpoint,
            (event: SocketWrapperMessageEvent) => {
                const parsedEvent = JSON.parse(event.data)
                if (!parsedEvent.result || !parsedEvent.result.data) return
                if (parsedEvent.result.data.type !== eventNewBlock) return
                this.parseGameEvent(parsedEvent.result.events)
            },
            (event: SocketWrapperErrorEvent) => { console.error(event) }
        )

        this.socket.connect()
    }

    static register(registry: Registry) {
        registry.register(typeMsgCreate, MsgCreate)
        registry.register(typeMsgCreate, MsgCreate)
        registry.register(typeMsgBuild, MsgBuild)
        registry.register(typeMsgMove, MsgMove)
        registry.register(typeMsgChangeParams, MsgChangeParams)
        registry.register(typeMsgExec, MsgExec)
    }

    async subscribeToGame(
        id: Long, 
        onUpdate: (state: State) => void, 
        onEnd: (winners: string[]) => void): Promise<void> {
        if (this.onUpdate) {
            throw new Error("already subscribed to game events")
        }

        this.onUpdate = onUpdate
        this.onEnd = onEnd

        await this.socket.connected

        await this.socket.send(JSON.stringify({
            jsonrpc: "2.0",
            method: "subscribe",
            id: "0",
            params: {
                query: `${eventGame}.${attributeGameID}='${id.toString()}'`
            }
        }))
        console.log("subscribed to game " + id.toString())
        console.log(`${eventGame}.${attributeGameID}='${id.toString()}'`)
    }

    async unsubscribeToGame() : Promise<void> {
        await this.socket.send(JSON.stringify({
            jsonrpc: "2.0",
            method: "unsubscribe",
            id: "0"
        }))
        this.onUpdate = undefined

        this.socket.disconnect()
    }   

    parseGameEvent(events: any) {
        if (!this.onUpdate || !this.onEnd) {
            console.error("received game update but no subscription set")
            return
        }

        if (!events) {
            console.error("no events")
            return
        }

        if (events["game.game.state"]) {
            const state = JSON.parse(events["game.game.state"]) as State
            // need to sanitize the output because any value with a zero is omitted
            if (!state.gaia) state.gaia = []
            for (const faction of state.factions) {
                if (!faction.resources) {
                    faction.resources = {
                        food: 0,
                        stone: 0,
                        wood: 0,
                        population: 0,
                        tech: 0,
                    }
                }
                if (!faction.resources.wood) {
                    faction.resources.wood = 0
                }
                for (const populace of faction.population) {
                    if (populace.settlement === undefined) {
                        populace.settlement = Settlement.NONE
                    }
    
                    if (!populace.position) {
                        populace.position = { x: 0, y: 0 }
                        continue
                    }
    
                    if (!populace.position.x) {
                        populace.position.x = 0
                    }
                    if (!populace.position.y) {
                        populace.position.y = 0
                    }
                }
            }
    
            console.log(state)
            this.onUpdate(state)
        }

        if (events["game.game.winners"]) {
            console.log(events["game.game.winners"])
            this.onEnd(events["game.game.winners"] as string[])
        }

    }
}

export class GameMsgClient implements IGameMsgClient {
    private client: SigningStargateClient
    private tmClient: Tendermint34Client
    private readonly address: string

    constructor(client: SigningStargateClient, tmClient: Tendermint34Client, address: string) {
        this.client = client
        this.tmClient = tmClient
        this.address = address
    }

    private async send(request: any, typeUrl: string): Promise<BroadcastTxSyncResponse> {
        const msgExecute: MsgExec = {
            grantee: this.address,
            msgs: [{
                typeUrl: typeUrl,
                value: request
            }]
        }
        const txRaw = await this.client.sign(
            this.address,
            [{
                typeUrl: typeMsgExec,
                value: msgExecute
            }],
            defaultFee,
            ""
        )
        const txBytes = TxRaw.encode(txRaw).finish();
        const resp = this.tmClient.broadcastTxSync({ tx: txBytes })

        return resp
    }

    async Move(request: MsgMove): Promise<MsgMoveResponse> {
        try {
            const resp = await this.send(MsgMove.encode(request).finish(), typeMsgMove)
            console.log(resp)
        } catch (e) {
            console.error(e)
        }
        return {}
    }

    async Build(request: MsgBuild): Promise<MsgBuildResponse> {
        try {
            const resp = await this.send(MsgBuild.encode(request).finish(), typeMsgBuild)
            console.log(resp)
        } catch (e) {
            console.error(e)
        }
        return {}
    }

    // TODO: these haven't yet been implemented but we don't expect a player account
    // to be executing any of these functions
    async Create(request: MsgCreate): Promise<MsgCreateResponse> {
        throw new Error("Not implemented")
        // const resp = await this.send(request, typeMsgCreate)
        // console.log(resp.data)
        // if (resp.data === undefined)
        //     throw new Error(resp.rawLog)
        // return MsgCreateResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse> {
        throw new Error("Not implemented")
        // const resp = await this.send(request, typeMsgChangeParams)
        // console.log(resp.data)
        // if (resp.data === undefined)
        //     throw new Error(resp.rawLog)
        // return MsgChangeParamsResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }
}