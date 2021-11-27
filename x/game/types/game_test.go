package types

import (
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var (
	alice   = "alice"
	bob     = "bob"
	charles = "charles"
	players = []string{alice, bob, charles}
	config  = DefaultConfig()
	params  = DefaultParams()
)

func TestNewGame(t *testing.T) {
	config.Map.Seed = 9876
	game, err := SetupGame(players, &config, 1, time.Now())
	require.NoError(t, err)

	require.Equal(t, len(game.State.Factions), len(game.Players))
	require.Equal(t, len(game.State.Gaia), 0)

	for idx, player := range game.Players {
		require.Equal(t, players[idx], player)
		faction, _, ok := game.FindFaction(player)
		require.True(t, ok)
		require.Contains(t, faction.Players, player)
		require.Equal(t, config.Initial.Resources, faction.Resources)
		require.Len(t, faction.Population, 1)
		require.Equal(t, config.Initial.Resources.Population, faction.Population[0].Amount)

		index := game.Map.GetIndex(faction.Population[0].Position)
		ter, ok := game.Territory[index]
		require.True(t, ok)
		require.Equal(t, ter.Faction, uint32(idx))
		require.Equal(t, ter.Populace, uint32(0))
	}

	require.Equal(t, uint64(0), game.State.Step)
	require.Len(t, game.Players, len(players))
}

func TestGameMove(t *testing.T) {
	testCases := []struct {
		description string
		player      string
		populace    uint32
		direction   Direction
		amount      uint32
		expErr      error
		assertion   func(t *testing.T, game *Game)
	}{
		{"towards a forest", charles, 0, Direction_DOWN, 1, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[2].Population[0].Position, NewPosition(1, 2))
			assertNoTerritory(t, game, 4)
			assertTerritory(t, game, 7)
			assertTurnUsed(t, game, charles, 0)
		}},
		{"towards a mountain", alice, 0, Direction_RIGHT, 2, ErrUnpassableTerrain, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[0].Population[0].Position, NewPosition(0, 0))
			assertNoTerritory(t, game, 1)
			assertTerritory(t, game, 0)
			assertTurnNotUsed(t, game, alice, 1)
		}},
		{"towards a lake", bob, 0, Direction_DOWN, 3, ErrUnpassableTerrain, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[1].Population[0].Position, NewPosition(0, 1))
			assertNoTerritory(t, game, 6)
			assertTerritory(t, game, 3)
			assertTurnNotUsed(t, game, bob, 0)
		}},
		{"towards plains", charles, 0, Direction_RIGHT, 1, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[2].Population[0].Position, NewPosition(2, 1))
		}},
		{"incorrect populace index", bob, 1, Direction_UP, 3, ErrInvalidPopulaceIndex, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[1].Population[0].Position, NewPosition(0, 1))
			assertTurnNotUsed(t, game, bob, 0)
		}},
		{"map wraps to the other side", bob, 0, Direction_LEFT, 3, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[1].Population[0].Position, NewPosition(2, 1))
		}},
		{"amount exceeds population", charles, 0, Direction_RIGHT, 2, ErrNotEnoughPopulation, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[2].Population[0].Position, NewPosition(1, 1))
			assertTurnNotUsed(t, game, charles, 0)
		}},
		{"merge two populations", alice, 1, Direction_RIGHT, 3, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[0].Population[0].Position, NewPosition(0, 0))
			assert.Equal(t, uint32(6), game.State.Factions[0].Population[0].Amount)
			assert.Equal(t, uint32(0), game.State.Factions[0].Population[1].Amount)
			assertNoTerritory(t, game, 2)
			assertTurnUsed(t, game, alice, 1)
			assertTurnNotUsed(t, game, alice, 0)
		}},
		{"conquer another factions settlement", bob, 0, Direction_RIGHT, 2, nil, func(t *testing.T, game *Game) {
			assert.Len(t, game.State.Factions[1].Population, 2)
			assert.Equal(t, &Populace{
				Amount:   1,
				Position: &Position{X: 1, Y: 1},
				// NOTE: We may add the law in the future that a rook has double
				// the protection
				Settlement: Settlement_ROOK,
			}, game.State.Factions[1].Population[1])
		}},
		{"stalemate when trying to conquer a capital", bob, 0, Direction_UP, 3, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, uint32(1), game.State.Factions[0].Population[0].Amount)
			assertNoTerritory(t, game, 3)
		}},
		{"not allowed to abandon capital", alice, 0, Direction_DOWN, 3, ErrAbandoningCapital, func(t *testing.T, game *Game) {
			assert.Equal(t, game.State.Factions[0].Population[0].Position, NewPosition(0, 0))
			assertTurnNotUsed(t, game, alice, 0)
		}},
		{"battle ends in a draw", bob, 0, Direction_RIGHT, 1, nil, func(t *testing.T, game *Game) {
			assertNoTerritory(t, game, 4)
			assert.Equal(t, uint32(2), game.State.Factions[1].Population[0].Amount)
			require.Len(t, game.State.Gaia, 1)
		}},
		{"invalid player", "jimmy", 0, Direction_RIGHT, 0, ErrPlayerNotInGame, nil},
	}

	for _, tc := range testCases {
		t.Run(tc.description, func(t *testing.T) {
			game, err := SetupGame(players, &config, 1, time.Now())
			require.NoError(t, err)

			buildCustomMap(game, []rune{
				'P', 'M', 'F',
				'P', 'P', 'P',
				'L', 'F', 'P',
			}, 3)
			forceSetStartingPopulace(game, [][]*Populace{
				{
					{
						Position:   &Position{X: 0, Y: 0}, // top left
						Amount:     3,
						Settlement: Settlement_CAPITAL,
					},
					{
						Position:   &Position{X: 2, Y: 0}, // top right
						Amount:     3,
						Settlement: Settlement_NONE,
					},
				},
				{{
					Position:   &Position{X: 0, Y: 1}, // middle left
					Amount:     3,
					Settlement: Settlement_FARM,
				}},
				{{
					Position:   &Position{X: 1, Y: 1}, // center
					Amount:     1,
					Settlement: Settlement_ROOK,
				}},
			})

			err = game.Move(tc.player, tc.populace, tc.direction, tc.amount)
			if tc.expErr != nil {
				require.True(t, errors.Is(err, tc.expErr))
			} else {
				require.NoError(t, err)
			}

			if tc.assertion != nil {
				tc.assertion(t, game)
			}
		})
	}
}

func TestGameCombat(t *testing.T) {
	testCases := []struct {
		description string
		player      string
		amount      uint32
		direction   Direction
		assertion   func(t *testing.T, game *Game)
	}{
		{"defeat opponent", charles, 7, Direction_UP, func(t *testing.T, game *Game) {
			assertNoTerritory(t, game, 3)
			assert.Len(t, game.State.Factions[2].Population, 1)
			assert.Len(t, game.State.Factions[0].Population, 0)
			assert.Equal(t, &Populace{
				Position:   &Position{X: 1, Y: 0},
				Amount:     2,
				Settlement: Settlement_NONE,
				Used:       false,
			}, game.State.Factions[2].Population[0])
		}},
		{"defender is stronger", alice, 5, Direction_DOWN, func(t *testing.T, game *Game) {
			assertNoTerritory(t, game, 1)
			assert.Len(t, game.State.Factions[0].Population, 0)
			assert.Equal(t, 2, game.State.Factions[2].Population[0].Amount)
		}},
	}

	for _, tc := range testCases {
		t.Run(tc.description, func(t *testing.T) {
			game, err := SetupGame(players, &config, 1, time.Now())
			require.NoError(t, err)

			buildCustomMap(game, []rune{
				'P', 'F',
				'P', 'P',
			}, 2)
			forceSetStartingPopulace(game, [][]*Populace{
				{{
					Position:   &Position{X: 1, Y: 0},
					Amount:     5,
					Settlement: Settlement_NONE,
				}},
				{{
					Position:   &Position{X: 0, Y: 0},
					Amount:     3,
					Settlement: Settlement_QUARRY,
				}},
				{{
					Position:   &Position{X: 1, Y: 1},
					Amount:     7,
					Settlement: Settlement_NONE,
				}},
			})
			err = game.Move(tc.player, 0, tc.direction, tc.amount)
			require.NoError(t, err)

			game.Update(params)

			if tc.assertion != nil {
				tc.assertion(t, game)
			}
		})
	}
}

func TestGameBuild(t *testing.T) {
	testCases := []struct {
		description string
		player      string
		populace    uint32
		settlement  Settlement
		expErr      error
		assertion   func(t *testing.T, game *Game)
	}{
		{"invalid settlement", bob, 0, Settlement_NONE, ErrInvalidSettlement, nil},
		{"player not in game", "jimmy", 0, Settlement_FARM, ErrPlayerNotInGame, nil},
		{"invalid populace index", bob, 1, Settlement_FARM, ErrInvalidPopulaceIndex, nil},
		{"insufficient resources", bob, 0, Settlement_CITY, ErrInsufficientResources, func(t *testing.T, game *Game) {
			assert.Equal(t, Settlement_NONE, game.State.Factions[1].Population[0].Settlement)
			assertTurnNotUsed(t, game, bob, 0)
		}},
		{"quarry must neighbor a mountain", bob, 0, Settlement_QUARRY, ErrQuarryLocation, nil},
		{"lumbermill must be in a forest", bob, 0, Settlement_LUMBERMILL, ErrLumbermillLocation, nil},
		{"successful build", bob, 0, Settlement_FARM, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, Settlement_FARM, game.State.Factions[1].Population[0].Settlement)
			assert.Equal(t, &ResourceSet{Wood: 2, Food: 7, Stone: 9, Population: 1}, game.State.Factions[1].Resources)
			assertTurnUsed(t, game, bob, 0)
		}},
		{"building over the top of an existing building", charles, 0, Settlement_FARM, nil, func(t *testing.T, game *Game) {
			assert.Equal(t, Settlement_FARM, game.State.Factions[2].Population[0].Settlement)
		}},
		{"can't build on final capital", alice, 0, Settlement_FARM, ErrAbandoningCapital, func(t *testing.T, game *Game) {
			assert.Equal(t, Settlement_CAPITAL, game.State.Factions[0].Population[0].Settlement)
			assertTurnNotUsed(t, game, alice, 0)
		}},
	}

	for _, tc := range testCases {
		t.Run(tc.description, func(t *testing.T) {
			config.Initial.Resources = &ResourceSet{Wood: 10, Food: 10, Stone: 10, Population: 1}
			game, err := SetupGame(players, &config, 1, time.Now())
			require.NoError(t, err)

			buildCustomMap(game, []rune{
				'P', 'M', 'F',
				'P', 'P', 'P',
				'L', 'F', 'P',
			}, 3)
			forceSetStartingPopulace(game, [][]*Populace{
				{{
					Position:   &Position{X: 0, Y: 0}, // top left
					Amount:     1,
					Settlement: Settlement_CAPITAL,
				}},
				{{
					Position:   &Position{X: 0, Y: 1}, // middle left
					Amount:     1,
					Settlement: Settlement_NONE,
				}},
				{{
					Position:   &Position{X: 1, Y: 1}, // center
					Amount:     1,
					Settlement: Settlement_ROOK,
				}},
			})

			err = game.Build(params, tc.player, tc.populace, tc.settlement)
			if tc.expErr != nil {
				require.True(t, errors.Is(err, tc.expErr))
			} else {
				require.NoError(t, err)
			}

			if tc.assertion != nil {
				tc.assertion(t, game)
			}
		})
	}
}

func TestMergeFactions(t *testing.T) {
	game, err := SetupGame(players, &config, 1, time.Now())
	require.NoError(t, err)

	buildCustomMap(game, []rune{'P', 'P', 'P', 'P'}, 2)
	forceSetStartingPopulace(game, [][]*Populace{
		{{
			Position: NewPosition(0, 0),
			Amount: 12,
			Settlement: Settlement_CAPITAL,
		}},
		{{
			Position: NewPosition(1, 0),
			Amount: 4,
			Settlement: Settlement_CAPITAL,
		}},
		{{
			Position: NewPosition(1, 1),
			Amount: 3,
			Settlement: Settlement_CAPITAL,
		}},
	})

	err = game.Move(alice, 0, Direction_RIGHT, 11)
	require.NoError(t, err)

	game.Update(params)
	finished, _ := game.IsCompleted(time.Now(), params)
	require.False(t, finished)

	require.Len(t, game.State.Factions, 2)
	require.Equal(t, &Faction{
		Players: []string{alice, bob},
		Population: []*Populace{
			{
				Position: NewPosition(0, 0),
				Amount: 3,
				Settlement: Settlement_CAPITAL,
			},
			{
				Position: NewPosition(1, 0),
				Amount: 9,
				Settlement: Settlement_CAPITAL,
			},
		},
		Resources: NewResources(13, 13, 13, 8),
	}, game.State.Factions[0])

	err = game.Move(alice, 1, Direction_DOWN, 8)
	require.NoError(t, err)

	game.Update(params)
	finished, victors := game.IsCompleted(time.Now(), params)
	require.True(t, finished, victors)
	require.Equal(t, []string{alice, bob}, victors)

	require.Len(t, game.State.Factions, 2)
	require.True(t, game.State.Factions[1].IsEmpty())
}

func buildCustomMap(g *Game, landscapes []rune, width uint32) {
	g.Map.Width = width
	g.Map.Tiles = make([]Landscape, len(landscapes))
	for idx, landscape := range landscapes {
		switch landscape {
		case 'M':
			g.Map.Tiles[idx] = Landscape_MOUNTAINS
		case 'F':
			g.Map.Tiles[idx] = Landscape_FOREST
		case 'P':
			g.Map.Tiles[idx] = Landscape_PLAINS
		case 'L':
			g.Map.Tiles[idx] = Landscape_LAKE
		default:
			panic(fmt.Sprintf("unknown landscape rune: %v", landscape))
		}
	}
}

func forceSetStartingPopulace(g *Game, pop [][]*Populace) {
	if len(pop) != len(g.Players) {
		panic(fmt.Sprintf("incorrect amount of starting points provided"))
	}

	for idx, population := range pop {
		g.State.Factions[idx].Population = population
	}

	g.Territory = make(map[uint32]*Territory)
	g.calculateTerritory()
}

func assertTerritory(t *testing.T, g *Game, idx int) {
	territory, ok := g.Territory[uint32(idx)]
	assert.True(t, ok, territory)
}

func assertNoTerritory(t *testing.T, g *Game, idx int) {
	territory, ok := g.Territory[uint32(idx)]
	assert.False(t, ok, territory)
}

func assertTurnUsed(t *testing.T, g *Game, player string, populace uint32) {
	faction, _, ok := g.FindFaction(player)
	require.True(t, ok)
	assert.True(t, faction.Population[populace].Used)
}

func assertTurnNotUsed(t *testing.T, g *Game, player string, populace uint32) {
	faction, _, ok := g.FindFaction(player)
	require.True(t, ok)
	assert.False(t, faction.Population[populace].Used)
}
