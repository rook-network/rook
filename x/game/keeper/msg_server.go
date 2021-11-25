package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rook-network/rook/x/game/types"
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
	ctx := sdk.UnwrapSDKContext(goCtx)

	gameID, err := m.Keeper.CreateGame(ctx, msg.Players, msg.Config)
	if err != nil {
		return nil, err
	}
	return &types.MsgCreateResponse{GameId: gameID}, nil
}

func (m msgServer) Build(goCtx context.Context, msg *types.MsgBuild) (*types.MsgBuildResponse, error) {
	resp := &types.MsgBuildResponse{}
	ctx := sdk.UnwrapSDKContext(goCtx)

	game, err := m.Keeper.GetGame(ctx, msg.GameId)
	if err != nil {
		return resp, err
	}

	params, err := m.Keeper.GetParams(ctx, game.ParamVersion)

	err = game.Build(params, msg.Creator, msg.Populace, msg.Settlement)
	if err != nil {
		return resp, err
	}

	m.Keeper.SetGame(ctx, msg.GameId, &game)
	return resp, nil
}

func (m msgServer) Move(goCtx context.Context, msg *types.MsgMove) (*types.MsgMoveResponse, error) {
	resp := &types.MsgMoveResponse{}
	ctx := sdk.UnwrapSDKContext(goCtx)

	ctx.Logger().Error("Received Move Request", "msg", msg)

	game, err := m.Keeper.GetGame(ctx, msg.GameId)
	if err != nil {
		return resp, err
	}

	err = game.Move(msg.Creator, msg.Populace, msg.Direction, msg.Population)
	if err != nil {
		return resp, err
	}

	m.Keeper.SetGame(ctx, msg.GameId, &game)
	ctx.Logger().Error("Finished Move Request", "msg", msg)
	return resp, err
}

func (m msgServer) ChangeParams(goCtx context.Context, msg *types.MsgChangeParams) (*types.MsgChangeParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	err := msg.Params.ValidateBasic()
	if err != nil {
		return &types.MsgChangeParamsResponse{}, err
	}

	version := m.Keeper.SetParams(ctx, msg.Params)

	return &types.MsgChangeParamsResponse{Version: version}, nil
}
