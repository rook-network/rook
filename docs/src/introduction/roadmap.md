# Roadmap

::: tip NOTE
Rook is still a work in progress and therefore documentation you see here could change.
:::

The Rook roadmap is broken down into four phases:

<details>
<summary>Phase 1: <strong>Core Game Logic</strong></summary>

- `x/game` module to support concurrent multiplayer games.
  - Create `MsgMove` and `MsgBuild` as well as validation logic.
  - Build simple map generator from random seed.
  - Add termination logic.
- `x/matchmaker` module with support for hosting and joining rooms as well as discovery functionality based on shared preferences.
- `x/claim` module for handling of airdrop allocation.
- Update to v0.44 Cosmos SDK and include `x/auth` module.
- Write custom Ante Handler for zero gas action transactions.
- Unit and simulation testing.
- Create documentation pages.
- Build minimum frontend application with landing page, public matchmaking and game GUI.

</details>

---

<details>
<summary>Phase 2: <strong>Single Node Alpha Testnet</strong></summary>

- Snapshot Cosmos Hub accounts and generate genesis file
- Run a single node semi-private testnet
- Add play-ahead functionality
- Improve on-chain game logic:
  - Add technology as a resource
  - Write logic for capturing and merging factions

</details>

---

<details>
<summary>Phase 3: <strong>Incentivised Beta Testnet</strong></summary>

- Build `x/marketplace` for trading of in-game NFT's and paired alonside the Cosmos SDK's own `nft` module.
- Add trait system attached to factions.
- Include the first set of rare settlements and design the corresponding visuals.
- Introduce more modes and allow for private matches.
- In

</details>

---

<details>
<summary>Phase 4:<strong> Mainnet Launch and Beyond</strong></summary>

- Launch :tada:
- Set up governance proposal to enable IBC transfers
- Create a bootstrapping liquidity pool.
- Organise first large scale tournament game

</details>

![City](../images/City.png)
