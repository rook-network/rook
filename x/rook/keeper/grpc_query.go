package keeper

import (
	"github.com/cmwaters/rook/x/rook/types"
)

var _ types.QueryServer = Keeper{}
