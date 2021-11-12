package types

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	EventRoom = "matchmaker.room"

	AttributeRoomID       = "room_id"
	AttributeGameID       = "game_id"
	AttributePlayerJoined = "player_joined"
	AttributePlayerLeft   = "player_left"
)

func NewPlayerJoinedEvent(roomID uint64, player string) sdk.Event {
	return sdk.NewEvent(EventRoom,
		sdk.NewAttribute(AttributeRoomID, fmt.Sprintf("%d", roomID)),
		sdk.NewAttribute(AttributePlayerJoined, player),
	)
}

func NewPlayerLeftEvent(roomID uint64, player string) sdk.Event {
	return sdk.NewEvent(EventRoom,
		sdk.NewAttribute(AttributeRoomID, fmt.Sprintf("%d", roomID)),
		sdk.NewAttribute(AttributePlayerJoined, player),
	)
}

func NewGameStartedEvent(roomID, gameID uint64) sdk.Event {
	return sdk.NewEvent(EventRoom,
		sdk.NewAttribute(AttributeRoomID, fmt.Sprintf("%d", roomID)),
		sdk.NewAttribute(AttributeGameID, fmt.Sprintf("%d", gameID)),
	)
}
