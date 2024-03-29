# Moves

Now we have reached the point where the game is underway. The game now begins its step-like sequence where every step, factions submit to the network the set of moves they would like to make. These then get executed and the new state of the game is calculated and broadcasted for both participants and onlookers alike.

Each move is based around a populace i.e. if a faction has 10 populace scattered over the map, then it can effectively make 10 moves in that step.

## Build

A player can order a particular populace to build a settlement where it currently stands so long as the faction has adequate resources. If there is an existing settlement here, this will be replaced with the new one. Construction of settlements are instant and the effects take place in the following step

## Move

If a populace didn't build that step it could instead move. Unless using a trait, movement is restricted to the four tiles directly adjacent to the current one. Populace are also unable to move over seas or mountains. If there are 10 population at a tile, a player can choose to move only 5 population and keep the other 5 remaining. Alternatively, it is possible to merge two populations of the same faction together. When a population moves into the tile occupied by an opposing faction, the faction with the greatest population wins, the remaining population is calculated from the modulo of the two forces.

To help with the smooth functioning of the game, players don't just have to select the moves for the next step but can plan future moves 3 or 4 steps in the future that will automatically be executed so long as nothing changes that might prevent them.

## Step Update

As well as the active moves taken by a player, at the close of every step, all the resources of each faction are updated.

::: tip A Quick Note on Gas
All game moves have zero gas. That is to say that there are no transaction fees associated with `Build` and `Move` actions. The fees for running the game are all calculated in the creation of the game.
:::
