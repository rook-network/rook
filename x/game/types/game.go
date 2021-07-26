package types

import (
	"fmt"
	"math/rand"

	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// Game is the in memory representation of an instance of the rook game.
type Game struct {
	// state
	Factions map[string]*Faction
	Gaia     []*Populace
	Step     uint64
	// overview
	Map     *Map
	Version uint32

	// cached fields
	params  *Params
	players []string // immutable
	// map position index -> { player index, populace index }
	territory map[int]territory
	// check to see if the player/populace has already done their turn
	used map[string]map[uint32]struct{}
}

// CONSTRUCTORS
func NewGame(players []string, config *Config, params *Params) (*Game, error) {
	gameMap := GenerateMap(config.Map)
	factions := make(map[string]*Faction, len(players))

	startingPositions, err := gameMap.RandomStartingPoints(rand.New(rand.NewSource(config.Map.Seed)), len(players))
	if err != nil {
		return nil, err
	}

	for idx, player := range players {
		factions[player] = NewFaction(player, config.Initial.Resources, startingPositions[idx])
	}
	g := &Game{
		Factions:  factions,
		Map:       gameMap,
		Gaia:      make([]*Populace, 0),
		Step:      0,
		params:    params,
		players:   players,
		territory: make(map[int]territory),
		used:      make(map[string]map[uint32]struct{}),
	}
	g.initializeUsedMap()
	g.calculateTerritory()
	return g, nil
}

func LoadGame(state *State, overview *Overview, params *Params) *Game {
	factions := make(map[string]*Faction, len(state.Players))
	players := make([]string, len(state.Players))
	for idx, faction := range state.Players {
		factions[faction.Player] = faction
		players[idx] = faction.Player
	}

	g := &Game{
		Factions:  factions,
		players:   players,
		Gaia:      state.Gaia,
		Map:       overview.Map,
		Step:      state.Step,
		params:    params,
		Version:   overview.ParamVersion,
		territory: make(map[int]territory),
		used:      make(map[string]map[uint32]struct{}),
	}
	g.initializeUsedMap()
	g.calculateTerritory()

	return g
}

// ACTIONS
//
// The game is characterised by two possible actions. Moving and building. The
// following two methods entail how each of these actions changes the games
// state

func (g *Game) Build(player string, populace uint32, settlement Settlement) error {
	if settlement == Settlement_NONE {
		return sdkerrors.Wrap(ErrInvalidSettlement, Settlement_name[int32(settlement)])
	}

	// Validate that the player is part of the game
	faction, ok := g.Factions[player]
	if !ok {
		return sdkerrors.Wrap(ErrPlayerNotInGame, player)
	}

	// Validate that the populace exists
	if int(populace) >= len(faction.Population) {
		return sdkerrors.Wrap(ErrInvalidPopulaceIndex,
			fmt.Sprintf("%d >= %d", int(populace), len(faction.Population)))
	}

	// Validate that the player's populace has not already acted
	if _, ok := g.used[player][populace]; ok {
		return sdkerrors.Wrap(ErrPopulaceAlreadActed,
			fmt.Sprintf("step=%d, populace=%d", g.Step, populace))
	}

	// Check that the faction has sufficient resources
	if !faction.Resources.CanAfford(g.params.ConstructionCost[int(settlement)]) {
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

	// mark the populace as used it's move
	g.used[player][populace] = struct{}{}

	// Pay for the settlement
	faction.Resources.Pay(g.params.ConstructionCost[int(settlement)])

	// Update the settlement at the populace. NOTE: This will replace an
	// existing settlement
	faction.Population[int(populace)].Settlement = settlement

	// action was a success!!
	return nil
}

func (g *Game) Move(player string, populace uint32, direction Direction, amount uint32) error {
	// Validate that the player is part of the game
	faction, ok := g.Factions[player]
	if !ok {
		return sdkerrors.Wrap(ErrPlayerNotInGame, player)
	}

	// Validate that the populace exists
	if int(populace) >= len(faction.Population) {
		return sdkerrors.Wrap(ErrInvalidPopulaceIndex,
			fmt.Sprintf("%d >= %d", int(populace), len(faction.Population)))
	}

	// Validate that the player's populace has not already acted
	if _, ok := g.used[player][populace]; ok {
		return sdkerrors.Wrap(ErrPopulaceAlreadActed,
			fmt.Sprintf("step=%d, populace=%d", g.Step, populace))
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
	g.used[player][populace] = struct{}{}

	newIndex := g.Map.GetNeighbor(index, direction)
	territory, ok := g.territory[newIndex]
	newPos := g.Map.GetPosition(newIndex)

	// Are we moving into an existing territory?
	if ok {
		existingPlayer := g.players[territory.Faction]
		existingPopulace := g.Factions[existingPlayer].Population[territory.Populace]
		// Does the territory belong to the player
		if existingPlayer == player {
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
				amount -= existingPopulace.Amount
				// reduce the existing population to 0. This will get flushed at
				// the end of the block
				existingPopulace.Amount = 0
				// create a new populace in its place
				faction.Population = append(faction.Population, &Populace{
					Amount:     amount,
					Position:   newPos,
					Settlement: existingPopulace.Settlement,
				})
				// update the territory
				territory.Faction = g.playerIndex(player)
				// add the index of the new populace to the territory
				territory.Populace = len(faction.Population) - 1

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
					delete(g.territory, newIndex)
					
					if existingPopulace.Settlement != Settlement_NONE {
						g.Gaia = append(g.Gaia, &Populace{
							Amount: 0,
							Position: existingPopulace.Position,
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
			delete(g.territory, index)
			// the populace itself will get flushed in end block
		}

	} else {
		// The player is marching into new unchartered territory
		if amount == pop.Amount { // with the entire population
			pop.Position = newPos
			g.territory[newIndex] = g.territory[index].Copy()
			delete(g.territory, index)
		} else { // with a portion of the population
			pop.Amount -= amount
			faction.Population = append(faction.Population, &Populace{
				Amount:     amount,
				Position:   newPos,
				Settlement: g.getFactionlessSettlementAtPos(newPos),
			})
			g.territory[newIndex] = newTerritory(g.playerIndex(player), len(faction.Population)-1)
		}
	}

	// action was a success!!
	return nil
}

// The persistence of a game is divided into two parts. The overview which
// remains constant throughout the duration of the game, and state which gets
// updated after each height.

// State extracts out the state component of the game
func (g Game) State() *State {
	players := make([]*Faction, len(g.Factions))
	for idx, player := range g.players {
		players[idx] = g.Factions[player]
	}

	return &State{
		Players: players,
		Gaia:    g.Gaia,
		Step:    g.Step,
	}
}

// Overview extracts out the overview component of the game
func (g Game) Overview() *Overview {
	return &Overview{
		Map:          g.Map,
		ParamVersion: g.Version,
	}
}

// Update loops through all factions and calculates how many resources were reaped
// in that step, updates the population and performs any other passive actions
func (g Game) Update() {
	for _, faction := range g.Factions {
		faction.Reap()
	}
	g.Step++
}

func (g Game) playerIndex(player string) int {
	for idx, p := range g.players {
		if player == p {
			return idx
		}
	}
	return -1
}

func (g Game) getFactionlessSettlementAtPos(pos *Position) Settlement {
	for _, populace := range g.Gaia {
		if populace.Position.Equals(pos) {
			return populace.Settlement
		}
	}
	return Settlement_NONE
}

func (g *Game) calculateTerritory() {
	for playerIdx, player := range g.players {
		faction := g.Factions[player]
		for popIdx, populace := range faction.Population {
			posIdx := g.Map.GetIndex(populace.Position)
			g.territory[posIdx] = newTerritory(playerIdx, popIdx)
		}
	}
}

func (g *Game) initializeUsedMap() {
	for _, player := range g.players {
		g.used[player] = make(map[uint32]struct{})
	}
}

type territory struct {
	Faction  int
	Populace int
}

func (t territory) Copy() territory {
	return newTerritory(t.Faction, t.Populace)
}

func newTerritory(faction, populace int) territory {
	return territory{
		Faction:  faction,
		Populace: populace,
	}
}
