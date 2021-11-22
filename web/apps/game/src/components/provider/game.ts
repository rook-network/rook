import { QueryClientImpl as GameQueryClient } from '../../codec/rook/game/query'
import _m0 from "protobufjs/minimal";
import { 
    Msg as IGameMsgClient, MsgCreate, MsgBuild, MsgMove, MsgChangeParams,
    MsgCreateResponse, MsgBuildResponse, MsgMoveResponse, MsgChangeParamsResponse
} from '../../codec/rook/game/tx'
import { SocketWrapper, SocketWrapperMessageEvent, SocketWrapperErrorEvent } from '@cosmjs/socket'
import { Registry, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, QueryClient, createProtobufRpcClient } from '@cosmjs/stargate'
import { defaultFee } from './types'
import { Provider } from './root'
import { State } from '../../codec/rook/game/game'
import config from '../../config';
import { runInThisContext } from 'vm';

export const typeMsgCreate = "/rook.game.MsgCreate"
export const typeMsgBuild = "/rook.game.MsgBuild"
export const typeMsgMove = "/rook.game.MsgMove"
export const typeMsgChangeParams = "/rook.game.MsgChamgeParams"

export const eventGame = "game.game"
export const eventNewBlock = "tendermint/event/NewBlock"

export const attributeGameID = "game_id"
export const attributeState = "state"

export class GameProvider {
    private readonly address: string
    public query: GameQueryClient
    public tx: IGameMsgClient

    private socket: SocketWrapper
    private onUpdate?: (state: State) => void

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

        return new GameProvider(provider.getQuerier(), client, address)
    }

    constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new GameQueryClient(protoRpcClient)
        this.tx = new GameMsgClient(client, address)
        this.address = address
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
    }

    async subscribeToGame(id: Long, onUpdate: (state: State) => void): Promise<void> {
        if (this.onUpdate) {
            throw new Error("already subscribed to game events")
        }

        this.onUpdate = onUpdate

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
        if (!this.onUpdate) {
            console.error("received game update but no subscription set")
            return
        }

        if (!events) {
            console.error("no events")
            return
        }

        if (!events["game.game.state"]) {
            console.error("no event containing game state updates")
        }

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

    getAddress(): string {
        return this.address
    }
}

export class GameMsgClient implements IGameMsgClient {
    private client: SigningStargateClient
    private readonly address: string

    constructor(client: SigningStargateClient, address: string) {
        this.client = client
        this.address = address
    }

    private async send(request: any, typeUrl: string) {
        return await this.client.signAndBroadcast(
            this.address,
            [{ typeUrl: typeUrl, value: request}],
            defaultFee
        )
    }

    async Move(request: MsgMove): Promise<MsgMoveResponse> {
        const resp = await this.send(request, typeMsgMove)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgMoveResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async Build(request: MsgBuild): Promise<MsgBuildResponse> {
        const resp = await this.send(request, typeMsgBuild)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgBuildResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async Create(request: MsgCreate): Promise<MsgCreateResponse> {
        const resp = await this.send(request, typeMsgCreate)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgCreateResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }

    async ChangeParams(request: MsgChangeParams): Promise<MsgChangeParamsResponse> {
        const resp = await this.send(request, typeMsgChangeParams)
        console.log(resp.data)
        if (resp.data === undefined)
            throw new Error(resp.rawLog)
        return MsgChangeParamsResponse.decode(new _m0.Reader(resp.data[0]!.data))
    }
}