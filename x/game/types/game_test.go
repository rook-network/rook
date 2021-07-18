package types

import (
	"testing"

	"github.com/stretchr/testify/require"
)

var (
	players = []string{"alice", "bob", "charles"}
	config = DefaultConfig()
)

func TestNewGame(t *testing.T) {
	config.Map.Seed = 9876
	game, err := NewGame(players, config)
	require.NoError(t, err)
	for idx, faction := range game.Factions {
		require.Equal(t, players[idx], faction.Player)
		require.Equal(t, config.Initial.Resources, faction.Resources)
		require.Len(t, faction.Population, 1)
		require.Equal(t, config.Initial.Resources.Population, faction.Population[0].Amount)
	}

	state := game.State()
	require.Equal(t, uint64(0), state.Step)
	require.Len(t, state.Players, len(players))
	require.True(t, state.Map.Equal(game.Map))
}