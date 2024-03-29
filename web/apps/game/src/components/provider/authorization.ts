import { QueryClient, SigningStargateClient, createProtobufRpcClient } from '@cosmjs/stargate';
import { GenericAuthorization } from '../../codec/cosmos/authz/v1beta1/authz'
import { QueryClientImpl as AuthzQueryClient } from '../../codec/cosmos/authz/v1beta1/query'
import { MsgGrant, MsgExec } from '../../codec/cosmos/authz/v1beta1/tx'
import { MsgGrantAllowance } from '../../codec/cosmos/feegrant/v1beta1/tx'
import { BasicAllowance, AllowedMsgAllowance } from '../../codec/cosmos/feegrant/v1beta1/feegrant'
import { Any } from '../../codec/google/protobuf/any'
import { typeMsgBuild, typeMsgMove } from './game'
import { defaultFee } from './types'
import { Registry } from '@cosmjs/proto-signing'

const typeGenericAuthorization = "/cosmos.authz.v1beta1.GenericAuthorization"
const typeMsgGrant = "/cosmos.authz.v1beta1.MsgGrant"
export const typeMsgExec = "/cosmos.authz.v1beta1.MsgExec"
const typeMsgGrantAllowance = "/cosmos.feegrant.v1beta1.MsgGrantAllowance"
const typeBasicAllowance = "/cosmos.feegrant.v1beta1.BasicAllowance"
const typeAllowedMsgAllowance = "/cosmos.feegrant.v1beta1.AllowedMsgAllowance"

const buildGrant: GenericAuthorization = {
  msg: typeMsgBuild,
}

const moveGrant: GenericAuthorization = {
  msg: typeMsgMove,
}

const basicAllowance: BasicAllowance = {
  spendLimit: []
}

const playerAllowance: AllowedMsgAllowance = {
  allowance: {
    typeUrl: typeBasicAllowance,
    value: BasicAllowance.encode(basicAllowance).finish(),
  },
  allowedMessages: [typeMsgMove, typeMsgBuild]
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
    registry.register(typeMsgGrantAllowance, MsgGrantAllowance)
    registry.register(typeMsgExec, MsgExec)
  }

  async authorizePlayerAccount(player: string): Promise<void> {
    console.log("authorizing player " + player)
    const messages = [
      {
        typeUrl: typeMsgGrantAllowance,
        value: this.createFeeAllowanceMsg(player)
      },
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
        },
        // it's currently not possible to have no expiration so we set something
        // far in the future (5 years)
        expiration: setExpiry(5), 
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
        },
        expiration: setExpiry(5),
      }
    }
  }

  createFeeAllowanceMsg(player: string): MsgGrantAllowance {
    return { 
      granter: this.address,
      grantee: player,
      allowance: {
        typeUrl: typeAllowedMsgAllowance,
        value: AllowedMsgAllowance.encode(playerAllowance).finish()
      }
    }
  }

}

function setExpiry(years: number): Date {
  const d = new Date()
  const y = d.getFullYear()
  const months = d.getMonth()
  const days = d.getDay()
  return new Date(y + years, months, days)
}