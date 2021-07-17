package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
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

func (m msgServer) Create(goCtx context.Context, msg *types.MsgCreate) (*types.MsgCreateResponse, error) {
	return &types.MsgCreateResponse{GameId: 1}, nil
}

func (m msgServer) Build(goCtx context.Context, msg *types.MsgBuild) (*types.MsgBuildResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgBuildResponse{}, nil
}

func (m msgServer) Move(goCtx context.Context, msg *types.MsgMove) (*types.MsgMoveResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgMoveResponse{}, nil
}
