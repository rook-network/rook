package types

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/rook-network/rook/x/game/types"
)

var (
	config  = types.DefaultConfig()
	players = []string{"alice", "bob", "charlie", "david", "emily"}
)

func TestRoomAddingPlayers(t *testing.T) {
	room := NewCustomRoom(config, players[:2], []string{}, true, 2, 4, time.Now())

	require.True(t, room.HasQuorum())
	require.False(t, room.IsFull())
	require.False(t, room.IsEmpty())

	err := room.TryAddPlayer(players[2])
	require.NoError(t, err)

	err = room.TryAddPlayer(players[3])
	require.NoError(t, err)
	require.True(t, room.IsFull())

	err = room.TryAddPlayer(players[4])
	require.Error(t, err)
}

func TestRoomRemovePlayers(t *testing.T) {
	room := NewCustomRoom(config, players[:2], []string{}, true, 2, 4, time.Now())

	require.True(t, room.HasQuorum())

	room.RemovePlayer(players[3])
	require.True(t, room.HasQuorum())

	room.RemovePlayer(players[1])
	require.False(t, room.HasQuorum())
	require.False(t, room.IsEmpty())

	room.RemovePlayer(players[0])
	require.True(t, room.IsEmpty())
}

func TestKeys(t *testing.T) {
	var (
		roomID uint64 = 12
		modeID uint32 = 345
	)

	roomBytes := RoomKey(roomID)
	require.Equal(t, roomID, ParseRoomKey(roomBytes))

	modeBytes := ModeKey(modeID)
	require.Equal(t, modeID, ParseModeKey(modeBytes))
}
