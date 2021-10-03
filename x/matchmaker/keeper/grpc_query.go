package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"

	"github.com/arcane-systems/rook/x/matchmaker/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Room(goCtx context.Context, req *types.QueryGetRoomRequest) (*types.QueryGetRoomResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	room, exists := q.GetRoom(ctx, req.Id)
	if !exists {
		return nil, sdkerrors.Wrapf(types.ErrRoomNotFound, "%d", req.Id)
	}
	return &types.QueryGetRoomResponse{Room: &room}, nil
}

func (q Keeper) Invitations(goCtx context.Context, req *types.QueryGetInvitationsRequest) (*types.QueryGetInvitationsResponse, error) {
	return &types.QueryGetInvitationsResponse{}, nil
}

func (q Keeper) Modes(goCtx context.Context, req *types.QueryGetModesRequest) (*types.QueryGetModesResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	store := ctx.KVStore(q.storeKey)
	modes := make(map[uint32]*types.Mode)

	iter := store.Iterator(
		types.ModeKey(0),
		types.ModeKey(1<<31-1),
	)
	for ; iter.Valid(); iter.Next() {
		modeID := types.ParseModeKey(iter.Key())
		var mode types.Mode
		q.cdc.MustUnmarshal(iter.Value(), &mode)
		modes[modeID] = &mode
	}

	return &types.QueryGetModesResponse{Modes: modes}, nil
}

func (q Keeper) Params(goCtx context.Context, req *types.QueryGetParamsRequest) (*types.QueryGetParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	params := q.GetParams(ctx)
	return &types.QueryGetParamsResponse{Params: &params}, nil
}
