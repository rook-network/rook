package types

import (
	"math/rand"
)

type Game struct {
	Factions []*Faction
	Map      *Map
	Step     uint64
}

func NewGame(players []string, config *Config) (*Game, error) {
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
		Step:     0,
	}, nil
}

func (g Game) State() *State {
	return &State{
		Players: g.Factions,
		Map:     g.Map,
		Step:    g.Step,
	}
}

func NewFaction(player string, resources *ResourceSet, startingPosition *Position) *Faction {
	return &Faction{
		Player:    player,
		Resources: resources,
		Population: []*Populace{
			{
				Amount:   resources.Population,
				Position: startingPosition,
			},
		},
	}

}

func NewPosition(x, y uint32) *Position {
	return &Position{X: x, Y: y}
}

func PositionFromIndex(index uint32, width uint32) *Position {
	return NewPosition(index%width, index/width)
}
