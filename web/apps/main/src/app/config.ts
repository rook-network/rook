// import { Bech32Address } from "@keplr-wallet/cosmos";

// export const EmbedChainInfos = [
//   {
//     rpc: "http://localhost:26657",
//     rest: "http://localhost:1317",
//     chainId: "rook-single",
//     chainName: "Rook",
//     stakeCurrency: {
//       coinDenom: "ROOK",
//       coinMinimalDenom: "urook",
//       coinDecimals: 6,
//       coinGeckoId: "cosmos",
//     },
//     // walletUrl:
//     //   process.env.NODE_ENV === "production"
//     //     ? "https://wallet.keplr.app/#/cosmoshub/stake"
//     //     : "http://localhost:8081/#/cosmoshub/stake",
//     // walletUrlForStaking:
//     //   process.env.NODE_ENV === "production"
//     //     ? "https://wallet.keplr.app/#/cosmoshub/stake"
//     //     : "http://localhost:8081/#/cosmoshub/stake",
//     bip44: {
//       coinType: 118,
//     },
//     bech32Config: Bech32Address.defaultBech32Config("rook"),
//     currencies: [
//       {
//         coinDenom: "ROOK",
//         coinMinimalDenom: "urook",
//         coinDecimals: 6,
//         coinGeckoId: "cosmos",
//       },
//     ],
//     feeCurrencies: [
//       {
//         coinDenom: "ROOK",
//         coinMinimalDenom: "urook",
//         coinDecimals: 6,
//         coinGeckoId: "cosmos",
//       },
//     ],
//     coinType: 118,
//     features: ["stargate", "ibc-transfer"],
//   },
// ];