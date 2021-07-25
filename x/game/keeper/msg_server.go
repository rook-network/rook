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
	ctx := sdk.UnwrapSDKContext(goCtx)

	params, ok := m.Keeper.params[m.Keeper.latestVersion]
	if !ok {
		panic("unable to find latest params")
	}

	game, err := types.NewGame(msg.Players, msg.Config, params)
	if err != nil {
		return nil, err
	}

	gameID, err := m.Keeper.GetNextGameID(ctx)
	if err != nil {
		return nil, err
	}

	// persist the game overview. We will save game state in the end block
	m.Keeper.SaveGameOverview(ctx, gameID, game.Overview())

	m.Keeper.games[gameID] = game
	return &types.MsgCreateResponse{GameId: gameID}, nil
}

func (m msgServer) Build(_ context.Context, msg *types.MsgBuild) (*types.MsgBuildResponse, error) {
	resp := &types.MsgBuildResponse{}

	game, err := m.Keeper.GetGame(msg.GameId)
	if err != nil {
		return resp, err
	}

	err = game.Build(msg.Creator, msg.Populace, msg.Settlement)

	return resp, err
}

func (m msgServer) Move(_ context.Context, msg *types.MsgMove) (*types.MsgMoveResponse, error) {
	resp := &types.MsgMoveResponse{}

	game, err := m.Keeper.GetGame(msg.GameId)
	if err != nil {
		return resp, err
	}

	err = game.Move(msg.Creator, msg.Populace, msg.Direction, msg.Population)

	return resp, err
}

func (m msgServer) ChangeParams(goCtx context.Context, msg *types.MsgChangeParams) (*types.MsgChangeParamsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	err := msg.Params.ValidateBasic()
	if err != nil {
		return &types.MsgChangeParamsResponse{}, err
	}

	m.Keeper.SetParams(ctx, msg.Params)

	return &types.MsgChangeParamsResponse{Version: m.Keeper.LatestParamsVersion()}, nil
}
