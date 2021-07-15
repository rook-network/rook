package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/matchmaker/types"
)

type msgServer struct {
	Keeper
}

// NewMsgServerImpl returns an implementation of the MsgServer interface
// for the provided Keeper.
func NewMsgServerImpl(keeper Keeper) types.MsgServer {
	return &msgServer{Keeper: keeper}
}

var _ types.MsgServer = msgServer{}

func (m msgServer) Host(goCtx context.Context, msg *types.MsgHost) (*types.MsgHostResponse, error) {
	return &types.MsgHostResponse{1}, nil
}

func (m msgServer) Join(ctx context.Context, msg *types.MsgJoin) (*types.MsgJoinResponse, error) {
	return &types.MsgJoinResponse{}, nil
}

func (m msgServer) Find(ctx context.Context, msg *types.MsgFind) (*types.MsgFindResponse, error) {
	return &types.MsgFindResponse{}, nil
}

func (m msgServer) Ready(ctx context.Context, msg *types.MsgReady) (*types.MsgReadyResponse, error) {
	return &types.MsgReadyResponse{}, nil
}