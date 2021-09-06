// THIS FILE IS GENERATED AUTOMATICALLY. DO NOT MODIFY.
import { SigningStargateClient } from "@cosmjs/stargate";
import { Registry } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgRemoveMode } from "./types/rook/matchmaker/tx";
import { MsgHost } from "./types/rook/matchmaker/tx";
import { MsgAddMode } from "./types/rook/matchmaker/tx";
import { MsgLeave } from "./types/rook/matchmaker/tx";
import { MsgJoin } from "./types/rook/matchmaker/tx";
import { MsgFind } from "./types/rook/matchmaker/tx";
const types = [
    ["/rook.matchmaker.MsgRemoveMode", MsgRemoveMode],
    ["/rook.matchmaker.MsgHost", MsgHost],
    ["/rook.matchmaker.MsgAddMode", MsgAddMode],
    ["/rook.matchmaker.MsgLeave", MsgLeave],
    ["/rook.matchmaker.MsgJoin", MsgJoin],
    ["/rook.matchmaker.MsgFind", MsgFind],
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
        msgRemoveMode: (data) => ({ typeUrl: "/rook.matchmaker.MsgRemoveMode", value: data }),
        msgHost: (data) => ({ typeUrl: "/rook.matchmaker.MsgHost", value: data }),
        msgAddMode: (data) => ({ typeUrl: "/rook.matchmaker.MsgAddMode", value: data }),
        msgLeave: (data) => ({ typeUrl: "/rook.matchmaker.MsgLeave", value: data }),
        msgJoin: (data) => ({ typeUrl: "/rook.matchmaker.MsgJoin", value: data }),
        msgFind: (data) => ({ typeUrl: "/rook.matchmaker.MsgFind", value: data }),
    };
};
const queryClient = async ({ addr: addr } = { addr: "http://localhost:1317" }) => {
    return new Api({ baseUrl: addr });
};
export { txClient, queryClient, };
