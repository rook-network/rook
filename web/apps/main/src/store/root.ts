// import {
//   ChainStore,
//   QueriesStore,
//   AccountStore,
//   QueriesWithCosmos,
//   AccountWithCosmos,
//   getKeplrFromWindow,
// } from "@keplr-wallet/stores";
// import { IndexedDBKVStore } from "@keplr-wallet/common";
// import { ChainInfo } from "@keplr-wallet/types";
// import { EmbedChainInfos } from "../app/config";

// export class RootStore {
//   public readonly chainStore: ChainStore;

//   public readonly queriesStore: QueriesStore<QueriesWithCosmos>;
//   public readonly accountStore: AccountStore<AccountWithCosmos>;

//   constructor() {
//     this.chainStore = new ChainStore<ChainInfo>(EmbedChainInfos);

//     this.queriesStore = new QueriesStore(
//       new IndexedDBKVStore("store_queries"),
//       this.chainStore,
//       getKeplrFromWindow,
//       QueriesWithCosmos
//     );

//     this.accountStore = new AccountStore(
//       window,
//       AccountWithCosmos,
//       this.chainStore,
//       this.queriesStore,
//       {
//         defaultOpts: {
//           prefetching: false,
//           suggestChain: false,
//           autoInit: true,
//           getKeplr: getKeplrFromWindow,
//         },
//       }
//     );
//   }
// }

// export function createRootStore() {
//   return new RootStore();
// }
