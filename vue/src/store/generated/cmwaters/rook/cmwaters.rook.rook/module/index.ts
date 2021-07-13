// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.

import { StdFee } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry, OfflineSigner, EncodeObject, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgBuild } from "./types/rook/tx";
import { MsgCreate } from "./types/rook/tx";
import { MsgMove } from "./types/rook/tx";


const types = [
  ["/cmwaters.rook.rook.MsgBuild", MsgBuild],
  ["/cmwaters.rook.rook.MsgCreate", MsgCreate],
  ["/cmwaters.rook.rook.MsgMove", MsgMove],
  
];
export const MissingWalletError = new Error("wallet is required");

const registry = new Registry(<any>types);

const defaultFee = {
  amount: [],
  gas: "200000",
};

interface TxClientOptions {
  addr: string
}

interface SignAndBroadcastOptions {
  fee: StdFee,
  memo?: string
}

const txClient = async (wallet: OfflineSigner, { addr: addr }: TxClientOptions = { addr: "http://localhost:26657" }) => {
  if (!wallet) throw MissingWalletError;

  const client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry });
  const { address } = (await wallet.getAccounts())[0];

  return {
    signAndBroadcast: (msgs: EncodeObject[], { fee, memo }: SignAndBroadcastOptions = {fee: defaultFee, memo: ""}) => client.signAndBroadcast(address, msgs, fee,memo),
    msgBuild: (data: MsgBuild): EncodeObject => ({ typeUrl: "/cmwaters.rook.rook.MsgBuild", value: data }),
    msgCreate: (data: MsgCreate): EncodeObject => ({ typeUrl: "/cmwaters.rook.rook.MsgCreate", value: data }),
    msgMove: (data: MsgMove): EncodeObject => ({ typeUrl: "/cmwaters.rook.rook.MsgMove", value: data }),
    
  };
};

interface QueryClientOptions {
  addr: string
}

const queryClient = async ({ addr: addr }: QueryClientOptions = { addr: "http://localhost:1317" }) => {
  return new Api({ baseUrl: addr });
};

export {
  txClient,
  queryClient,
};
