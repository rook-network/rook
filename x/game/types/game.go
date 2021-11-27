package types

import (
	"fmt"
	"math/rand"
	"time"

	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// CONSTRUCTORS
func SetupGame(players []string, config *Config, paramVersion uint32, start time.Time) (*Game, error) {
	gameMap := GenerateMap(config.Map)
	teams := len(players)
	if config.Initial.Teams > 1 {
		teams = int(config.Initial.Teams)
	}
	factions := make([]*Faction, teams)

	startingPositions, err := gameMap.RandomStartingPoints(rand.New(rand.NewSource(config.Map.Seed)), teams)
	if err != nil {
		return nil, err
	}
	playersPerTeam := len(players) / teams
	playerIdx := 0
	for i := 0; i < teams; i++ {
		if i == teams-1 {
			factions[i] = NewFaction(players[playerIdx:], config.Initial.Resources, startingPositions[i])
		} else {
			factions[i] = NewFaction(players[playerIdx:playerIdx+playersPerTeam], config.Initial.Resources, startingPositions[i])
			playerIdx += playersPerTeam
		}
	}

	game := &Game{
		Players:      players,
		Map:          gameMap,
		State:        NewState(factions, []*Populace{}),
		ParamVersion: paramVersion,
		Territory:    make(map[uint32]*Territory),
		StartTime:    &start,
	}
	game.calculateTerritory()

	return game, nil
}

func NewGame(overview Overview, state *State) *Game {
	game := &Game{
		Players:      overview.Players,
		Map:          overview.Map,
		State:        state,
		ParamVersion: overview.ParamVersion,
		Territory:    make(map[uint32]*Territory),
	}
	game.calculateTerritory()
	return game
}

// ACTIONS
//
// The game is characterised by two possible actions. Moving and building. The
// following two methods entail how each of these actions changes the games
// state

func (g *Game) Build(params Params, player string, populace uint32, settlement Settlement) error {
	if settlement == Settlement_NONE {
		return sdkerrors.Wrap(ErrInvalidSettlement, Settlement_name[int32(settlement)])
	}

	// Validate that the player is part of the game
	faction, _, ok := g.FindFaction(player)
	if !ok {
		return sdkerrors.Wrap(ErrPlayerNotInGame, player)
	}

	// Validate that the populace exists
	if int(populace) >= len(faction.Population) {
		return sdkerrors.Wrap(ErrInvalidPopulaceIndex,
			fmt.Sprintf("%d >= %d", int(populace), len(faction.Population)))
	}

	// Validate that the player's populace has not already acted
	if faction.Population[populace].Used {
		return sdkerrors.Wrap(ErrPopulaceAlreadActed,
			fmt.Sprintf("step=%d, populace=%d", g.State.Step, populace))
	}

	// Check that the faction has sufficient resources
	if !faction.Resources.CanAfford(params.ConstructionCost[int(settlement)]) {
		return sdkerrors.Wrap(ErrInsufficientResources, player)
	}

	// Check that the user isn't building over the last remaining capital
	if faction.Population[int(populace)].Settlement == Settlement_CAPITAL &&
		faction.Capitals() == 1 {
		return sdkerrors.Wrap(ErrAbandoningCapital, fmt.Sprintf("populace=%d", populace))
	}

	// Get the position of the new settlement
	pos := faction.Population[int(populace)].Position

	switch settlement {
	case Settlement_LUMBERMILL:
		// If the settlement is a lumbermill it must be over a forest
		if g.Map.GetLandscape(pos) != Landscape_FOREST {
			return sdkerrors.Wrap(ErrLumbermillLocation, pos.String())
		}
	case Settlement_QUARRY:
		// If the settlement is a quarry it must neighbor a mountain
		index := g.Map.GetIndex(pos)
		mountains := false
		for _, direction := range Directions {
			if g.Map.GetNeighborLandscape(index, direction) == Landscape_MOUNTAINS {
				mountains = true
			}
		}
		if !mountains {
			return sdkerrors.Wrap(ErrQuarryLocation, pos.String())
		}
	}

	// All validity checks have passed. Now we update state.

	// mark the populace as used its move
	faction.Population[populace].Used = true

	// Pay for the settlement
	faction.Resources.Pay(params.ConstructionCost[int(settlement)])

	// Update the settlement at the populace. NOTE: This will replace an
	// existing settlement
	faction.Population[int(populace)].Settlement = settlement

	// action was a success!!
	return nil
}

func (g *Game) Move(player string, populace uint32, direction Direction, amount uint32) error {
	// Validate that the player is part of the game
	faction, factionIdx, ok := g.FindFaction(player)
	if !ok {
		return sdkerrors.Wrap(ErrPlayerNotInGame, player)
	}

	// Validate that the populace exists
	if int(populace) >= len(faction.Population) {
		return sdkerrors.Wrap(ErrInvalidPopulaceIndex,
			fmt.Sprintf("%d >= %d", int(populace), len(faction.Population)))
	}

	// Validate that the player's populace has not already acted
	if faction.Population[populace].Used {
		return sdkerrors.Wrap(ErrPopulaceAlreadActed,
			fmt.Sprintf("step=%d, populace=%d", g.State.Step, populace))
	}

	pop := faction.Population[int(populace)]

	// Validate that the amount to move is less than or equal to total
	// population
	if amount > pop.Amount {
		return sdkerrors.Wrap(ErrNotEnoughPopulation,
			fmt.Sprintf("%d > %d", amount, pop.Amount))
	}

	// Validate that the population is allowed to move in that direction
	index := g.Map.GetIndex(pop.Position)
	landscape := g.Map.GetNeighborLandscape(index, direction)
	if landscape == Landscape_MOUNTAINS || landscape == Landscape_LAKE {
		return sdkerrors.Wrap(ErrUnpassableTerrain, Landscape_name[int32(landscape)])
	}

	// NOTE: There is no rule within the game that stops a player from
	// abandoning a settlement with the exception of a capital which
	// must always be occupied (in conflicts over a capital, there can
	// never be a draw)
	if pop.Amount == amount && pop.Settlement == Settlement_CAPITAL {
		return sdkerrors.Wrap(ErrAbandoningCapital, pop.Position.String())
	}

	// All validity checks have passed. Now we update state.

	// mark the populace as used it's move
	faction.Population[populace].Used = true

	newIndex := g.Map.GetNeighbor(index, direction)
	territory, ok := g.Territory[newIndex]
	newPos := g.Map.GetPosition(newIndex)

	// Are we moving into an existing territory?
	if ok {
		existingPopulace := g.State.Factions[territory.Faction].Population[territory.Populace]
		// Does the territory belong to the same faction
		if territory.Faction == uint32(factionIdx) {
			// We increase the population of the new populace and decrease the
			// population of the old populace
			existingPopulace.Amount += amount

		} else {
			// The territory belongs to an opponent
			switch {
			case existingPopulace.Amount > amount:
				// defender is victorious
				existingPopulace.Amount -= amount

			case existingPopulace.Amount < amount:
				// attacker is victorious
				// create a new populace in its place
				faction.Population = append(faction.Population, &Populace{
					Amount:     amount - existingPopulace.Amount,
					Position:   newPos,
					Settlement: existingPopulace.Settlement,
				})

				// If the last capital has been captured then we merge the two
				// factions
				if existingPopulace.Settlement == Settlement_CAPITAL {
					if g.State.Factions[territory.Faction].Capitals() == 1 {
						g.MergeFactions(factionIdx, int(territory.Faction))
					}
				}
				// reduce the existing population to 0. This will get flushed at
				// the end of the block
				existingPopulace.Amount = 0

				// update the territory
				territory.Faction = uint32(g.playerIndex(player))
				// add the index of the new populace to the territory
				territory.Populace = uint32(len(faction.Population) - 1)

			case existingPopulace.Amount == amount:
				// There is a draw.
				// If the settlement is a capital than they get the benefit of
				// the doubt and survive (as there can't be a draw)
				if existingPopulace.Settlement == Settlement_CAPITAL {
					existingPopulace.Amount = 1
				} else {
					// Else we reduce populace to zero
					existingPopulace.Amount = 0
					// and remove the territory
					delete(g.Territory, newIndex)

					if existingPopulace.Settlement != Settlement_NONE {
						g.State.Gaia = append(g.State.Gaia, &Populace{
							Amount:     0,
							Position:   existingPopulace.Position,
							Settlement: existingPopulace.Settlement,
						})
					}
				}
			}

		}

		// reduce the population
		pop.Amount -= amount

		// Is there any remainding population at the old position
		if pop.Amount == 0 {
			delete(g.Territory, index)
			// the populace itself will get flushed in end block
		}

	} else {
		// The player is marching into new unchartered territory
		if amount == pop.Amount { // with the entire population
			pop.Position = newPos
			g.Territory[newIndex] = g.Territory[index].Copy()
			delete(g.Territory, index)
		} else { // with a portion of the population
			pop.Amount -= amount
			faction.Population = append(faction.Population, &Populace{
				Amount:     amount,
				Position:   newPos,
				Settlement: g.getFactionlessSettlementAtPos(newPos),
			})
			g.Territory[newIndex] = NewTerritory(g.playerIndex(player), len(faction.Population)-1)
		}
	}

	// action was a success!!
	return nil
}

func (g Game) FindFaction(player string) (*Faction, int, bool) {
	for idx, faction := range g.State.Factions {
		if faction.HasPlayer(player) {
			return faction, idx, true
		}
	}
	return nil, -1, false
}

func (g *Game) RemovePlayer(player string) {
	for idx, p := range g.Players {
		if p == player {
			g.Players = append(g.Players[:idx], g.Players[idx+1:]...)
			break
		}
	}
	for _, faction := range g.State.Factions {
		for idx, p := range faction.Players {
			if p == player {
				faction.Players = append(faction.Players[:idx], faction.Players[idx+1:]...)
				break
			}
		}
	}
}

// Update loops through all factions and calculates how many resources were reaped
// in that step, updates the population and performs any other passive actions
func (g *Game) Update(params Params) {
	for _, faction := range g.State.Factions {
		faction.Flush()
		faction.Reap(params)
	}
	g.resetUsedPopulace()
	g.State.Step++
}

func (g Game) Snapshot() GameSnapshot {
	return GameSnapshot{
		Map:          g.Map,
		State:        g.State,
		ParamVersion: g.ParamVersion,
	}
}

// MergeFactions merges two faction together
func (g Game) MergeFactions(f1, f2 int) {
	// if this wasn't the final merge then remove the faction
	if len(g.State.Factions) > 2 {
		g.State.Factions[f1].Merge(g.State.Factions[f2])
		for _, territory := range g.Territory {
			if territory.Faction == uint32(f2) {
				territory.Faction = uint32(f1)
			} 
		}

		g.State.Factions = append(g.State.Factions[:f2], g.State.Factions[f2+1:]...)
		for _, territory := range g.Territory {
			if territory.Faction > uint32(f2) {
				territory.Faction--
			}
		}
	} else {
		// else treat the faction as if it were sacked so we know who the winning team are
		g.SackFaction(f1, f2)
	}
}

// Sacking a faction takes all the resources but still leaves the faction in tack
func (g Game) SackFaction(f1, f2 int) {
	g.State.Factions[f1].Sack(g.State.Factions[f2])
	for _, territory := range g.Territory {
		if territory.Faction == uint32(f2) {
			territory.Faction = uint32(f1)
		} 
	}
}

// IsCompleted checks the termination conditions of the game and returns the winning team
// if there is one. TODO: we should add a timeout
func (g Game) IsCompleted(now time.Time, params Params) (bool, []string) {
	if g.HasExpired(now, params.MaxGameDuration) {
		return true, []string{}
	}
	count := 0
	winners := []string{}
	for _, faction := range g.State.Factions {
		if !faction.IsEmpty() {
			count++
			winners = faction.Players
			if count > 1 {
				return false, []string{}
			}
		}
	}
	return true, winners
}

func (g Game) HasExpired(now time.Time, maxAge time.Duration) bool {
	return g.StartTime.Add(maxAge).Before(now)
}

func (g Game) playerIndex(player string) int {
	for idx, p := range g.Players {
		if player == p {
			return idx
		}
	}
	return -1
}

func (g *Game) resetUsedPopulace() {
	for _, faction := range g.State.Factions {
		for _, p := range faction.Population {
			p.Used = false
		}
	}
}

func (g Game) getFactionlessSettlementAtPos(pos *Position) Settlement {
	for _, populace := range g.State.Gaia {
		if populace.Position.Equals(pos) {
			return populace.Settlement
		}
	}
	return Settlement_NONE
}

func (g *Game) calculateTerritory() {
	for factionIdx, faction := range g.State.Factions {
		for popIdx, populace := range faction.Population {
			posIdx := g.Map.GetIndex(populace.Position)
			g.Territory[uint32(posIdx)] = NewTerritory(factionIdx, popIdx)
		}
	}
}

func (g Game) Overview() *Overview {
	return &Overview{
		Players:      g.Players,
		Map:          g.Map,
		ParamVersion: g.ParamVersion,
	}
}

func NewTerritory(faction, populace int) *Territory {
	return &Territory{
		Faction:  uint32(faction),
		Populace: uint32(populace),
	}
}

func (t Territory) Copy() *Territory {
	return &Territory{
		Faction:  t.Faction,
		Populace: t.Populace,
	}
}

func NewState(factions []*Faction, gaia []*Populace) *State {
	return &State{
		Factions: factions,
		Gaia:     gaia,
		Step:     0,
	}
}

func (s State) Players() []string {
	players := make([]string, 0)
	for _, faction := range s.Factions {
		players = append(players, faction.Players...)
	}
	return players
}
