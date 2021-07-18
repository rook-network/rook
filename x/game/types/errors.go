package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/rook module sentinel errors
var (
	ErrInvalidMapSize  = sdkerrors.Register(ModuleName, 1, "invalid map size")
	ErrGameCountNotSet = sdkerrors.Register(ModuleName, 2, "game ID counter not set in genesis")
	ErrSeedNotSet      = sdkerrors.Register(ModuleName, 3, "game seed is not set (must be non zero)")
	ErrGameNotFound    = sdkerrors.Register(ModuleName, 4, "game can not be found")

	// this line is used by starport scaffolding # ibc/errors
)
