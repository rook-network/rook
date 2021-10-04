package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/claim module sentinel errors
var (
	ErrClaimInactive    = sdkerrors.Register(ModuleName, 1100, "claimee must first activate their claim before performing other actions")
	ErrRecordNotFound   = sdkerrors.Register(ModuleName, 1101, "claim record not found")
	ErrAlreadyActivated = sdkerrors.Register(ModuleName, 1102, "claim has already been activated")
)
