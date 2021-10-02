# State

### Claim Records

A claim record is a struct that contains data about the claims process of each airdrop recipient.

It contains an address, the initial claimable airdrop amount, and an array of bools representing 
whether each action has been completed. The position in the array refers to enum number of the action.

So for example, `[false, true, true, false]` means that `ActionSwap` and `ActionVote` are completed.

```protobuf
// A Claim Records is the metadata of claim data per address
message ClaimRecord {
  // address of claim user
  string address = 1 [ (gogoproto.moretags) = "yaml:\"address\"" ];

  // total initial claimable amount for the user
  repeated cosmos.base.v1beta1.Coin initial_claimable_amount = 2 [
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins",
    (gogoproto.nullable) = false,
    (gogoproto.moretags) = "yaml:\"initial_claimable_amount\""
  ];

  // true if action is completed
  // index of bool in array refers to action enum #
  repeated bool action_completed = 3 [
    (gogoproto.moretags) = "yaml:\"action_completed\"",
    (gogoproto.nullable) = false
  ];
}
```
When a user get airdrop for his/her action, claim record is created to prevent duplicated actions on future actions.

### State

```protobuf
message GenesisState {
  // balance of the claim module's account
  cosmos.base.v1beta1.Coin module_account_balance = 1 [
    (gogoproto.moretags) = "yaml:\"module_account_balance\"",
    (gogoproto.nullable) = false
  ];

  // params defines all the parameters of the module.
  Params params = 2 [
    (gogoproto.moretags) = "yaml:\"params\"",
    (gogoproto.nullable) = false
  ];

  // list of claim records, one for every airdrop recipient
  repeated ClaimRecord claim_records = 3 [
    (gogoproto.moretags) = "yaml:\"claim_records\"",
    (gogoproto.nullable) = false
  ];
}
```

Claim module's state consists of `params`, `claim_records`, and `module_account_balance`.

### Params

Claim module provides below params

```protobuf
// Params defines the claim module's parameters.
message Params {
  google.protobuf.Timestamp airdrop_start_time = 1 [
    (gogoproto.stdtime) = true,
    (gogoproto.nullable) = false,
    (gogoproto.moretags) = "yaml:\"airdrop_start_time\""
  ];
  google.protobuf.Duration duration_until_decay = 2 [
    (gogoproto.nullable) = false,
    (gogoproto.stdduration) = true,
    (gogoproto.jsontag) = "duration_until_decay,omitempty",
    (gogoproto.moretags) = "yaml:\"duration_until_decay\""
  ];
  google.protobuf.Duration duration_of_decay = 3 [
    (gogoproto.nullable) = false,
    (gogoproto.stdduration) = true,
    (gogoproto.jsontag) = "duration_of_decay,omitempty",
    (gogoproto.moretags) = "yaml:\"duration_of_decay\""
  ];
  // denom of claimable asset
  string claim_denom = 4;
}
```

1. `airdrop_start_time` refers to the time when user can start to claim airdrop.
2. `duration_until_decay` refers to the duration from start time to decay start time.
3. `duration_of_decay` refers to the duration from decay start time to claim end time. Users are not able to claim airdrop after this.
4. `claim_denom` refers to the denomination of claiming tokens. As a default, it's `uosmo`.
