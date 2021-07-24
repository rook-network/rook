package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Game(ctx context.Context, req *types.QueryGetGameRequest) (*types.QueryGetGameResponse, error) {
	return &types.QueryGetGameResponse{}, nil
}

func (q Keeper) GameState(ctx context.Context, req *types.QueryGetGameStateRequest) (*types.QueryGetGameStateResponse, error) {
	return &types.QueryGetGameStateResponse{}, nil
}

func (q Keeper) Params(goCtx context.Context, req *types.QueryGetParamsRequest) (*types.QueryGetParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	params := q.GetParams(ctx, req.Version)

	return &types.QueryGetParamsResponse{Params: params}, nil
}
