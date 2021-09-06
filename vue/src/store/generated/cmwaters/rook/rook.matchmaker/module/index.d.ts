import { StdFee } from "@cosmjs/launchpad";
import { OfflineSigner, EncodeObject } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgRemoveMode } from "./types/rook/matchmaker/tx";
import { MsgHost } from "./types/rook/matchmaker/tx";
import { MsgAddMode } from "./types/rook/matchmaker/tx";
import { MsgLeave } from "./types/rook/matchmaker/tx";
import { MsgJoin } from "./types/rook/matchmaker/tx";
import { MsgFind } from "./types/rook/matchmaker/tx";
export declare const MissingWalletError: Error;
interface TxClientOptions {
    addr: string;
}
interface SignAndBroadcastOptions {
    fee: StdFee;
    memo?: string;
}
declare const txClient: (wallet: OfflineSigner, { addr: addr }?: TxClientOptions) => Promise<{
    signAndBroadcast: (msgs: EncodeObject[], { fee, memo }?: SignAndBroadcastOptions) => Promise<import("@cosmjs/stargate").BroadcastTxResponse>;
    msgRemoveMode: (data: MsgRemoveMode) => EncodeObject;
    msgHost: (data: MsgHost) => EncodeObject;
    msgAddMode: (data: MsgAddMode) => EncodeObject;
    msgLeave: (data: MsgLeave) => EncodeObject;
    msgJoin: (data: MsgJoin) => EncodeObject;
    msgFind: (data: MsgFind) => EncodeObject;
}>;
interface QueryClientOptions {
    addr: string;
}
declare const queryClient: ({ addr: addr }?: QueryClientOptions) => Promise<Api<unknown>>;
export { txClient, queryClient, };
