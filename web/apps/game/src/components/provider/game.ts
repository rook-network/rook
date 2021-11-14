import { QueryClientImpl as GameQueryClient } from '../../codec/rook/game/query'
import _m0 from "protobufjs/minimal";
import { 
    Msg as IGameMsgClient, MsgCreate, MsgBuild, MsgMove, MsgChangeParams,
    MsgCreateResponse, MsgBuildResponse, MsgMoveResponse, MsgChangeParamsResponse
} from '../../codec/rook/game/tx'
import { Registry, DirectSecp256k1HdWallet } from '@cosmjs/stargate/node_modules/@cosmjs/proto-signing'
import { SigningStargateClient, QueryClient, createProtobufRpcClient } from '@cosmjs/stargate'
import { defaultFee } from './types'
import { Provider } from './root'
import config from '../../config';

export const typeMsgCreate = "/rook.game.MsgCreate"
export const typeMsgBuild = "/rook.game.MsgBuild"
export const typeMsgMove = "/rook.game.MsgMove"
export const typeMsgChangeParams = "/rook.game.MsgChamgeParams"

export function registerGameMsgs(registry: Registry) {
    registry.register(typeMsgCreate, MsgCreate)
    registry.register(typeMsgCreate, MsgCreate)
    registry.register(typeMsgBuild, MsgBuild)
    registry.register(typeMsgMove, MsgMove)
    registry.register(typeMsgChangeParams, MsgChangeParams)
}

export class GameProvider {
    private readonly address: string
    public query: GameQueryClient
    public tx: IGameMsgClient

    public static async connect(provider: Provider) {
        const mainAddress = provider.getAddress()
        const serialized = window.localStorage.getItem(mainAddress)
        let wallet: DirectSecp256k1HdWallet
        if (serialized === null) {
            wallet = await DirectSecp256k1HdWallet.generate()
            window.localStorage.setItem(mainAddress, await wallet.serialize(mainAddress))
        } else {
            wallet = await DirectSecp256k1HdWallet.deserialize(serialized, mainAddress)
        }

        const registry = new Registry()
        registerGameMsgs(registry)

        const client = await SigningStargateClient.connectWithSigner(
            config.rpcEndpoint,
            wallet,
            { registry: registry }
        )

        const accounts = await wallet.getAccounts()
        const address = accounts[0].address
        console.log("connected with " + address)

        await provider.authorizePlayerAccount(address)

        return new GameProvider(provider.getQuerier(), client, address)
    }

    constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
        const protoRpcClient = createProtobufRpcClient(querier)
        this.query = new GameQueryClient(protoRpcClient)
        this.tx = new GameMsgClient(client, address)
        this.address = address
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