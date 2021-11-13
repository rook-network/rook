package keeper

import (
	"context"

	"github.com/arcane-systems/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Games(goCtx context.Context, req *types.QueryGamesRequest) (*types.QueryGamesResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	ids := make([]uint64, 0)

	memStore := ctx.KVStore(q.memKey)
	gameIter := memStore.Iterator(
		types.GameKey(0),
		types.GameKey(1<<63-1),
	)
	for ; gameIter.Valid(); gameIter.Next() {
		ids = append(ids, types.ParseGameKey(gameIter.Key()))
	}

	return &types.QueryGamesResponse{Ids: ids}, nil
}

func (q Keeper) Game(goCtx context.Context, req *types.QueryGameByIDRequest) (*types.QueryGameByIDResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	game, err := q.GetGame(ctx, req.Id)
	if err != nil {
		return nil, err
	}

	return &types.QueryGameByIDResponse{Game: game.Snapshot()}, nil
}

func (q Keeper) GameByPlayer(goCtx context.Context, req *types.QueryGameByPlayerRequest) (*types.QueryGameByPlayerResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	gameID, err := q.GetGameIDByPlayer(ctx, req.Player)
	if err != nil {
		return nil, err
	}

	game, err := q.GetGame(ctx, gameID)
	if err != nil {
		return nil, err
	}

	return &types.QueryGameByPlayerResponse{Game: game.Snapshot(), Id: gameID}, nil
}

func (q Keeper) State(goCtx context.Context, req *types.QueryGameStateRequest) (*types.QueryGameStateResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	game, err := q.GetGame(ctx, req.Id)
	if err != nil {
		return nil, err
	}
	return &types.QueryGameStateResponse{State: *game.State}, err
}

func (q Keeper) Params(goCtx context.Context, req *types.QueryParamsRequest) (*types.QueryParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	if req.Version == 0 {
		req.Version = q.GetLatestParamsVersion(ctx)
	}
	params, err := q.GetParams(ctx, req.Version)
	return &types.QueryParamsResponse{Params: params, Version: req.Version}, err
}
