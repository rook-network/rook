package keeper

import (
	"context"

	"github.com/arcane-systems/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) FindByID(goCtx context.Context, req *types.QueryGameByIDRequest) (*types.QueryGameByIDResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	overview, err := q.GetGameOverview(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &types.QueryGameByIDResponse{Overview: overview, Id: req.Id}, nil
}

func (q Keeper) FindByPlayer(goCtx context.Context, req *types.QueryGameByPlayerRequest) (*types.QueryGameByPlayerResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	gameID, err := q.GetGameIDByPlayer(ctx, req.Player)
	if err != nil {
		return nil, err
	}

	overview, err := q.GetGameOverview(ctx, gameID)
	if err != nil {
		return nil, err
	}

	return &types.QueryGameByPlayerResponse{Overview: overview, Id: gameID}, nil
}

func (q Keeper) State(goCtx context.Context, req *types.QueryGameStateRequest) (*types.QueryGameStateResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	state, err := q.GetGameState(ctx, req.Id)
	return &types.QueryGameStateResponse{State: state}, err
}

func (q Keeper) Params(goCtx context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	if req.Version == 0 {
		req.Version = q.GetLatestParamsVersion(ctx)
	}
	params, err := q.GetParams(ctx, req.Version)
	return &types.QueryParamsResponse{Params: params, Version: req.Version}, err
}
