package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/matchmaker/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
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
	ctx := sdk.UnwrapSDKContext(goCtx)

	room := types.NewRoom(msg.Config, msg.Invitees, msg.Public, msg.Quorum, msg.Capacity, ctx.BlockTime())

	roomID := m.Keeper.GetNextRoomID(ctx)

	m.Keeper.SetRoom(ctx, roomID, room)

	return &types.MsgHostResponse{roomID}, nil
}

func (m msgServer) Join(goCtx context.Context, msg *types.MsgJoin) (*types.MsgJoinResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	room, exists := m.Keeper.GetRoom(ctx, msg.RoomId)
	if !exists {
		return nil, sdkerrors.Wrapf(types.ErrRoomNotFound, "%d", msg.RoomId)
	}

	ready, err := room.TryAddPlayer(msg.Creator)
	if err != nil {
		return nil, err
	}

	if ready {
		room.ReadyUp(ctx.BlockTime())
	}

	m.Keeper.SetRoom(ctx, msg.RoomId, room)

	return &types.MsgJoinResponse{}, nil
}

func (m msgServer) Find(goCtx context.Context, msg *types.MsgFind) (*types.MsgFindResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	mode, exists := m.Keeper.GetMode(ctx, msg.Mode)
	if !exists {
		return nil, sdkerrors.Wrapf(types.ErrModeNotFound, "%d", msg.Mode)
	}

	var room types.CommonRoom
	room, exists = m.Keeper.GetCommonRoom(ctx, msg.Mode)
	if !exists {
		room = types.NewCommonRoom(msg.Mode, ctx.BlockTime())
	}
	full, ready, err := room.TryAddPlayer(msg.Creator, mode)
	if err != nil {
		return nil, err
	}

	if full {
		
	}

	if ready {

	}

	return &types.MsgFindResponse{}, nil
}

func (m msgServer) Ready(ctx context.Context, msg *types.MsgReady) (*types.MsgReadyResponse, error) {
	return &types.MsgReadyResponse{}, nil
}
