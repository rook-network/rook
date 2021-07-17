# Policies

*This section entails a list of policies that polities can customize*

| Name | Value    | Description |
|------|----------|-------------|
| Threshold | `u64` or `Ratio` | The value of tokens committed to a proposal for that proposal to pass. May be a ratio relative to the total weight of the polity |
| Election Period | `time::Duration` | The upper bound duration that an election can run for. Votes after this period are void and the proposal is garbage collected |
| Ammendable | `bool` | Indicates whether a proposal can have multiple versions |
| Tally Policy | ["linear", "quadratic"] | Indicates how votes are counted. Linear adds the tokens committed. Quadratic takes the square root of the tokens committed. |
| Participation Reward | `u32` | Indicates the bonus tokens the member who participated in the election receives (this is defaulted to 0 but can be set to further incentivise participation) |
| Max Token Leverage | `Ratio` | A cap on how many tokens, with respect to the members weight, a member can commit to a single proposal. |
| Serialized | `bool` | Indicates whether multiple proposals can be active at the same time or whether a queue system is used and only a single proposal can be voted on at a time. |
| Deposit | `u64` | Specifies the amount of tokens needed to submit a proposal. This is an anti-spam mechanism and proposers whose proposal is marked as such will not receive their deposit back. |
Proposal Cost | u64 | The cost (in member tokens) to submit a proposal. Default is 0 |
| Removal Threshold | `u64` or `Ratio` | The threshold required to remove a proposal |