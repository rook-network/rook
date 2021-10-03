package keeper

import (
	"context"

	"github.com/arcane-systems/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Game(goCtx context.Context, req *types.QueryGetGameRequest) (*types.QueryGetGameResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	var err error
	if req.Id == 0 {
		req.Id, err = q.GetGameID(ctx)
		if err != nil {
			return nil, err
		}
	}
	overview, err := q.GetGameOverview(ctx, req.Id)
	return &types.QueryGetGameResponse{Overview: overview, Id: req.Id}, err
}

func (q Keeper) GameState(goCtx context.Context, req *types.QueryGetGameStateRequest) (*types.QueryGetGameStateResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	var err error
	if req.Id == 0 {
		req.Id, err = q.GetGameID(ctx)
		if err != nil {
			return nil, err
		}
	}
	state, err := q.GetGameState(ctx, req.Id)
	return &types.QueryGetGameStateResponse{State: state}, err
}

func (q Keeper) Params(goCtx context.Context, req *types.QueryGetParamsRequest) (*types.QueryGetParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	if req.Version == 0 {
		req.Version = q.GetLatestParamsVersion(ctx)
	}
	params, err := q.GetParams(ctx, req.Version)
	return &types.QueryGetParamsResponse{Params: params, Version: req.Version}, err
}
