package types

import (
	"math/rand"
)

// Game is the in memory representation of an instance of the rook game. 
type Game struct {
	Factions []*Faction
	Gaia   []*Populace
	Map    *Map
	Step   uint64
	Params *Params
	Version uint32
}

// CONSTRUCTORS
func NewGame(players []string, config *Config, params *Params) (*Game, error) {
	gameMap := GenerateMap(config.Map)
	factions := make([]*Faction, len(players))

	startingPositions, err := gameMap.RandomStartingPoints(rand.New(rand.NewSource(config.Map.Seed)), len(players))
	if err != nil {
		return nil, err
	}

	for idx, player := range players {
		factions[idx] = NewFaction(player, config.Initial.Resources, startingPositions[idx])
	}
	return &Game{
		Factions: factions,
		Map:      gameMap,
		Gaia:     make([]*Populace, 0),
		Step:     0,
		Params:   params,
	}, nil
}

func LoadGame(state *State, overview *Overview, params *Params) *Game {
	return &Game{
		Factions: state.Players,
		Gaia:     state.Gaia,
		Map:      overview.Map,
		Step:     state.Step,
		Params:   params,
		Version:  overview.ParamVersion,
	}
}

// ACTIONS
//
// The game is characterised by two possible actions. Moving and building. The
// following two methods entail how each of these actions changes the games
// state

func (g *Game) Build(player string, settlement Settlement, position *Position) {

}

func (g *Game) Move(player string, ) {

}



// The persistence of a game is divided into two parts. The overview which
// remains constant throughout the duration of the game, and state which gets
// updated after each height.

// State extracts out the state component of the game
func (g Game) State() *State {
	return &State{
		Players: g.Factions,
		Gaia:    g.Gaia,
		Step:    g.Step,
	}
}

// Overview extracts out the overview component of the game
func (g Game) Overview() *Overview {
	return &Overview{
		Map: g.Map,
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

func NewPosition(x, y uint32) *Position {
	return &Position{X: x, Y: y}
}

func PositionFromIndex(index uint32, width uint32) *Position {
	return NewPosition(index%width, index/width)
}
