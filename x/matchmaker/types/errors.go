package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/matchmaker module sentinel errors
var (
	ErrRoomNotFound        = sdkerrors.Register(ModuleName, 1, "room not found")
	ErrPlayerAlreadyInRoom = sdkerrors.Register(ModuleName, 2, "player already in room")
	ErrPlayerNotInvited    = sdkerrors.Register(ModuleName, 3, "player has not been invited to this room")
	ErrRoomIsFull          = sdkerrors.Register(ModuleName, 4, "room is full")
	ErrModeNotFound        = sdkerrors.Register(ModuleName, 5, "mode not found")
	ErrModeAlreadyExists   = sdkerrors.Register(ModuleName, 6, "mode already exists")
	ErrModeCapacityReached = sdkerrors.Register(ModuleName, 7, "max capacity of diffennt modes has been reached")
)
