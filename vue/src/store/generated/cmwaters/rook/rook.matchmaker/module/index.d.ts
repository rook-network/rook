import { StdFee } from "@cosmjs/launchpad";
import { OfflineSigner, EncodeObject } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgFind } from "./types/rook/matchmaker/tx";
import { MsgJoin } from "./types/rook/matchmaker/tx";
import { MsgAddMode } from "./types/rook/matchmaker/tx";
import { MsgHost } from "./types/rook/matchmaker/tx";
import { MsgLeave } from "./types/rook/matchmaker/tx";
import { MsgRemoveMode } from "./types/rook/matchmaker/tx";
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
    msgFind: (data: MsgFind) => EncodeObject;
    msgJoin: (data: MsgJoin) => EncodeObject;
    msgAddMode: (data: MsgAddMode) => EncodeObject;
    msgHost: (data: MsgHost) => EncodeObject;
    msgLeave: (data: MsgLeave) => EncodeObject;
    msgRemoveMode: (data: MsgRemoveMode) => EncodeObject;
}>;
interface QueryClientOptions {
    addr: string;
}
declare const queryClient: ({ addr: addr }?: QueryClientOptions) => Promise<Api<unknown>>;
export { txClient, queryClient, };
