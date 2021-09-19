// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.

import { StdFee } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry, OfflineSigner, EncodeObject, DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgFind } from "./types/rook/matchmaker/tx";
import { MsgJoin } from "./types/rook/matchmaker/tx";
import { MsgAddMode } from "./types/rook/matchmaker/tx";
import { MsgHost } from "./types/rook/matchmaker/tx";
import { MsgLeave } from "./types/rook/matchmaker/tx";
import { MsgRemoveMode } from "./types/rook/matchmaker/tx";


const types = [
  ["/rook.matchmaker.MsgFind", MsgFind],
  ["/rook.matchmaker.MsgJoin", MsgJoin],
  ["/rook.matchmaker.MsgAddMode", MsgAddMode],
  ["/rook.matchmaker.MsgHost", MsgHost],
  ["/rook.matchmaker.MsgLeave", MsgLeave],
  ["/rook.matchmaker.MsgRemoveMode", MsgRemoveMode],
  
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
    msgFind: (data: MsgFind): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgFind", value: data }),
    msgJoin: (data: MsgJoin): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgJoin", value: data }),
    msgAddMode: (data: MsgAddMode): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgAddMode", value: data }),
    msgHost: (data: MsgHost): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgHost", value: data }),
    msgLeave: (data: MsgLeave): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgLeave", value: data }),
    msgRemoveMode: (data: MsgRemoveMode): EncodeObject => ({ typeUrl: "/rook.matchmaker.MsgRemoveMode", value: data }),
    
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
