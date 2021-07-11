package keeper

import (
	"github.com/cmwaters/rook/x/market/types"
)

var _ types.QueryServer = Keeper{}
