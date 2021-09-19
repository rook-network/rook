import { StdFee } from "@cosmjs/launchpad";
import { OfflineSigner, EncodeObject } from "@cosmjs/proto-signing";
import { Api } from "./rest";
import { MsgCreate } from "./types/rook/game/tx";
import { MsgMove } from "./types/rook/game/tx";
import { MsgBuild } from "./types/rook/game/tx";
import { MsgChangeParams } from "./types/rook/game/tx";
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
    msgCreate: (data: MsgCreate) => EncodeObject;
    msgMove: (data: MsgMove) => EncodeObject;
    msgBuild: (data: MsgBuild) => EncodeObject;
    msgChangeParams: (data: MsgChangeParams) => EncodeObject;
}>;
interface QueryClientOptions {
    addr: string;
}
declare const queryClient: ({ addr: addr }?: QueryClientOptions) => Promise<Api<unknown>>;
export { txClient, queryClient, };
