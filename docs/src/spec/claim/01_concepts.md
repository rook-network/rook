# Concepts

## Abstract

The claim module is a modified version the Osmosis claims module (all props go to them
for their great work). The module manages airdrop allocations based on on-chain activity
that accounts perform. Each action allows them to automatically claim a higher percentage
of their allotment. Airdrop supply is calculated as the square root of the balance of
Cosmos accounts at predefined snapshot time.

Furthermore, these claimable assets 'expire' if not claimed.
Users have two months (`DurationUntilDecay`) to claim their full airdrop amount.
After two months, the reward amount available will decline over two more months (`DurationOfDecay`) in real time, until it hits `0%` at 4 months from launch (`DurationUntilDecay + DurationOfDecay`).

## Actions

There are 5 actions in total that users have to perform to receive the full allotment. Thus,
for each action, a user will receive 20%. The 5 actions are as follows:

```golang
ActionActivate Action = 0
ActionPlay     Action = 1
ActionWin      Action = 2
ActionDelegate Action = 3
ActionTrade    Action = 4
```

Note that unlike Osmosis, users don't start with 20% but must register themselves (anyone can
register an address) by sending an `Activate` message. Only when the airdrop is activated can the
remainder of the airdrop be collected.

The rest of the actions are monitored by registring claim **hooks** to the staking, game, and market modules.
This means that when you perform an action, the claims module will immediately unlock those coins if they are applicable.
These remaining actions can be performed in any order.

The code is structured by separating out a segment of the tokens as "claimable", indexed by each action type.
So if Alice delegates tokens, the claims module will move the 20% of the claimables associated with staking to her liquid balance.
If she delegates again, there will not be additional tokens given, as the relevant action has already been performed.
Every action must be performed to claim the full amount.
