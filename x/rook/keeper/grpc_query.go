package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/rook/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Game(ctx context.Context, req *types.QueryGetGameRequest) (*types.QueryGetGameResponse, error) {
	return &types.QueryGetGameResponse{}, nil
}

func (q Keeper) Params(ctx context.Context, req *types.QueryGetParamsRequest) (*types.QueryGetParamsResponse, error) {
	return &types.QueryGetParamsResponse{}, nil
}
