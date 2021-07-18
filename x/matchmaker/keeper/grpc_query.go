package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/matchmaker/types"
)

var _ types.QueryServer = Keeper{}

func (q Keeper) Room(ctx context.Context, req *types.QueryGetRoomRequest) (*types.QueryGetRoomResponse, error) {
	return &types.QueryGetRoomResponse{}, nil
}

func (q Keeper) Pending(ctx context.Context, req *types.QueryGetPendingRequest) (*types.QueryGetPendingResponse, error) {
	return &types.QueryGetPendingResponse{}, nil
}

func (q Keeper) Invitations(ctx context.Context, req *types.QueryGetInvitationsRequest) (*types.QueryGetInvitationsResponse, error) {
	return &types.QueryGetInvitationsResponse{}, nil
}

func (q Keeper) Modes(ctx context.Context, req *types.QueryGetModesRequest) (*types.QueryGetModesResponse, error) {
	return &types.QueryGetModesResponse{}, nil
}

func (q Keeper) Params(ctx context.Context, req *types.QueryGetParamsRequest) (*types.QueryGetParamsResponse, error) {
	return &types.QueryGetParamsResponse{}, nil
}
