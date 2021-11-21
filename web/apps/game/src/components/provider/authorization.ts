import { QueryClient, SigningStargateClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { GenericAuthorization } from '../../codec/cosmos/authz/v1beta1/authz'
import { QueryClientImpl as AuthzQueryClient } from '../../codec/cosmos/authz/v1beta1/query'
import { MsgGrant } from '../../codec/cosmos/authz/v1beta1/tx'
import { Any } from '../../codec/google/protobuf/any'
import { typeMsgBuild, typeMsgMove } from './game'
import { defaultFee } from './types'
import { Registry } from '@cosmjs/proto-signing'

const typeGenericAuthorization = "/cosmos.authz.v1beta1.GenericAuthorization"
const typeMsgGrant = "/cosmos.authz.v1beta1.MsgGrant"

const buildGrant: GenericAuthorization = {
  msg: typeMsgBuild,
}

const moveGrant: GenericAuthorization = {
  msg: typeMsgMove,
}

export class AuthorizationProvider {
  public query: AuthzQueryClient
  private client: SigningStargateClient
  private address: string

  constructor(querier: QueryClient, client: SigningStargateClient, address: string) {
    const protoRpcClient = createProtobufRpcClient(querier)
    this.query = new AuthzQueryClient(protoRpcClient)
    this.client = client
    this.address = address
  }

  static register(registry: Registry) {
    registry.register(typeMsgGrant, MsgGrant)
  }

  async authorizePlayerAccount(player: string): Promise<void> {
    const messages = [
      {
        typeUrl: typeMsgGrant,
        value: this.createBuildGrantMsg(player)
      },
      {
        typeUrl: typeMsgGrant,
        value: this.createMoveGrantMsg(player)
      }
    ]

    console.log("sending authorization...")
    const resp = await this.client.signAndBroadcast(this.address, messages, defaultFee)
    console.log(resp)
    return
  }

  async checkPlayerAuthorized(player: string): Promise<boolean> {
    const resp = await this.query.Grants({
      granter: this.address,
      grantee: player,
      msgTypeUrl: "",
    })
    let buildAuth = false
    let moveAuth = false
    for (const grant of resp.grants) {
      if (!grant.authorization) continue

      if (grant.authorization.typeUrl !== typeGenericAuthorization ) continue


      console.log(grant.authorization)
      const auth = GenericAuthorization.decode(grant.authorization.value)
      console.log(auth)
      // console.log(GenericAuthorization.decode(auth.value))
      if (auth.msg === typeMsgBuild) {
        buildAuth = true
      } else if (auth.msg === typeMsgMove) {
        moveAuth = true
      }
    }
    return buildAuth && moveAuth
  }

  createBuildGrantMsg(player: string): MsgGrant {
    return {
      granter: this.address,
      grantee: player,
      grant: {
        authorization: {
          typeUrl: typeGenericAuthorization,
          value: GenericAuthorization.encode(buildGrant).finish()
        }
      }
    }
  }

  createMoveGrantMsg(player: string): MsgGrant {
    return {
      granter: this.address,
      grantee: player,
      grant: {
        authorization: {
          typeUrl: typeGenericAuthorization,
          value: GenericAuthorization.encode(moveGrant).finish()
        }
      }
    }
  }

}