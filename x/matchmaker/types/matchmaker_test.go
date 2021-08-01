package types

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestRemoveRoomIDFromRoom(t *testing.T) {
	room := NewRoomSet([]uint64{1, 2, 3})

	room.Remove(4)
	require.Len(t, room.Ids, 3)

	room.Remove(3)
	require.Len(t, room.Ids, 2)
	require.Equal(t, []uint64{1, 2}, room.Ids)

	room.Add(5)
	require.Len(t, room.Ids, 3)
	require.Equal(t, uint64(5), room.Ids[2])

	room.Remove(1)
	require.Len(t, room.Ids, 2)
	require.Equal(t, []uint64{2, 5}, room.Ids)
}
