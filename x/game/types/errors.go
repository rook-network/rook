package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/rook module sentinel errors
var (
	ErrInvalidMapSize = sdkerrors.Register(ModuleName, 1100, "invalid map size")
	// this line is used by starport scaffolding # ibc/errors
)
