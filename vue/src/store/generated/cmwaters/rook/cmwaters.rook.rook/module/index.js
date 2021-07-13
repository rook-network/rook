// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
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
const registry = new Registry(types);
const defaultFee = {
    amount: [],
    gas: "200000",
};
const txClient = async (wallet, { addr: addr } = { addr: "http://localhost:26657" }) => {
    if (!wallet)
        throw MissingWalletError;
    const client = await SigningStargateClient.connectWithSigner(addr, wallet, { registry });
    const { address } = (await wallet.getAccounts())[0];
    return {
        signAndBroadcast: (msgs, { fee, memo } = { fee: defaultFee, memo: "" }) => client.signAndBroadcast(address, msgs, fee, memo),
        msgBuild: (data) => ({ typeUrl: "/cmwaters.rook.rook.MsgBuild", value: data }),
        msgCreate: (data) => ({ typeUrl: "/cmwaters.rook.rook.MsgCreate", value: data }),
        msgMove: (data) => ({ typeUrl: "/cmwaters.rook.rook.MsgMove", value: data }),
    };
};
const queryClient = async ({ addr: addr } = { addr: "http://localhost:1317" }) => {
    return new Api({ baseUrl: addr });
};
export { txClient, queryClient, };
