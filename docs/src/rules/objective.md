# Objective

The main objective of each game is to capture or sack the capitals of all the other factions. Capturing a capital involves advancing your population into the tile of the opponents capital and overcoming whatever population currently resides there. Capturing the last capital settlement will automatically merge the two factions together. Now players from both factions must work together to overcome the remaining factions. Opting to capture and merge, allows for the benefits of parralelism - more players means that its easier to manage a large empire. However, this comes at the cost of coordinating and there's nothing stopping bad actors from sabotaging the faction.

The other option is to sack the final capital settlement. This involves deploying a special settlement, the `Rook` on a tile that is directly adjacent to the capital. The `Rook` will cease up the production of the capital, if the population is reduced to zero then the capital, like all other settlements will be destroyed and the faction will perish.

In some game modes, where there are numerous victory relics spread out over the map, a faction can also win by possessing all the relics at once.

## Rewards

When a victor has been found, the game is over. At the end of the game, the victors are rewarded with ROOK tokens. If it is a tournament game or their is money at stake this can be even more tokens. But how are the spoils distributed? The `RewardRatio` describes how much of the pie goes to the original players and how much to the rest of the players in that faction.

As an example. Say the default victor reward was 20 ROOK and the reward for winning the tournament was 100 ROOK. Let's say there started of 10 factions of two players and ended with the winning faction having 8 players. If the `RewardRatio` is 0.5, then out of the 120 ROOK, 30 ROOK goes to each of the original players (2) and the remaining 6 players earn 10 ROOK each.
