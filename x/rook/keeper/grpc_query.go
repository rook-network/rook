package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/rook/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Game(ctc context.Context, req *types.QueryGetGameRequest) (*types.QueryGetGameResponse, error) {
	return &types.QueryGetGameResponse{}, nil
}
