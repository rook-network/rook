package keeper

import (
	"github.com/cmwaters/rook/x/matchmaker/types"
)

var _ types.QueryServer = Keeper{}
