package keeper

import (
	"context"
	"fmt"

	"github.com/arcane-systems/rook/x/matchmaker/types"
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

	time := ctx.BlockTime()
	if msg.Scheduled != nil {
		time = *msg.Scheduled
	}

	roomID := m.Keeper.GetNextRoomID(ctx)

	var room types.Room
	switch g := msg.Game.(type) {
	case *types.MsgHost_Mode:
		room = types.NewRoom(g.Mode.Config, []string{msg.Creator}, msg.Invitees,
			msg.Public, g.Mode.Quorum, g.Mode.Capacity, time)

	case *types.MsgHost_ModeId:
		mode, exists := m.Keeper.GetMode(ctx, g.ModeId)
		if !exists {
			return nil, sdkerrors.Wrapf(types.ErrModeNotFound, "modeID: %d", g.ModeId)
		}
		room = types.NewRoom(mode.Config, []string{msg.Creator}, msg.Invitees,
			msg.Public, mode.Quorum, mode.Capacity, time)

		if msg.Public {
			rooms, exists := m.Keeper.GetRoomsByMode(ctx, g.ModeId)
			if !exists {
				panic("expected mode but found none")
			}

			rooms.Add(roomID)
			m.Keeper.SetRooms(ctx, g.ModeId, rooms)
		}
	}

	m.Keeper.SetRoom(ctx, roomID, room)

	m.Keeper.IncrementNextModeID(ctx)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId: roomID,
		AddedPlayers: []string{msg.Creator},
	})

	return &types.MsgHostResponse{RoomId: roomID}, nil
}

// Join
func (m msgServer) Join(goCtx context.Context, msg *types.MsgJoin) (*types.MsgJoinResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	room, exists := m.Keeper.GetRoom(ctx, msg.RoomId)
	if !exists {
		return nil, sdkerrors.Wrapf(types.ErrRoomNotFound, "%d", msg.RoomId)
	}

	err := room.TryAddPlayer(msg.Creator)
	if err != nil {
		return nil, err
	}

	// persist changes to that room
	m.Keeper.SetRoom(ctx, msg.RoomId, room)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId: msg.RoomId,
		AddedPlayers: []string{msg.Creator},
	})

	return &types.MsgJoinResponse{}, nil
}

// Find retrieves the next room that has the same modeID and is public and adds
// the player. If no room can be found, a new room is created with that player
func (m msgServer) Find(goCtx context.Context, msg *types.MsgFind) (*types.MsgFindResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	rooms, exists := m.Keeper.GetRoomsByMode(ctx, msg.Mode)
	if !exists {
		return nil, sdkerrors.Wrapf(types.ErrModeNotFound, "modeID: %d", msg.Mode)
	}

	if len(rooms.Ids) == 0 {
		mode, exists := m.Keeper.GetMode(ctx, msg.Mode)
		if !exists {
			panic("expected mode but found none")
		}

		msgHost := types.NewMsgHost(msg.Creator, []string{}, &mode, true)
		res, err := m.Host(goCtx, msgHost)
		if err != nil {
			return nil, err
		}

		rooms.Add(res.RoomId)
		m.Keeper.SetRooms(ctx, msg.Mode, rooms)

		return &types.MsgFindResponse{RoomId: res.RoomId}, nil
	}

	roomID := rooms.Ids[0]
	room, exists := m.Keeper.GetRoom(ctx, roomID)
	if !exists {
		panic("expected room but found none")
	}

	err := room.TryAddPlayer(msg.Creator)
	if err != nil {
		panic(fmt.Sprintf("unexpected error adding player to room: %v", err))
	}

	if room.IsFull() {
		rooms.Remove(rooms.Ids[0])
		m.Keeper.SetRooms(ctx, msg.Mode, rooms)
	}

	// persist changes to that room
	m.Keeper.SetRoom(ctx, roomID, room)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId: roomID,
		AddedPlayers: []string{msg.Creator},
	})

	return &types.MsgFindResponse{RoomId: roomID}, nil
}

// Leave is currently a NoOp
func (m msgServer) Leave(goCtx context.Context, msg *types.MsgLeave) (*types.MsgLeaveResponse, error) {
	return &types.MsgLeaveResponse{}, nil
}

// AddMode adds a new mode type to the pool.
// NOTE: This is designed as part of governance but currently anyone can create
// a new mode. There's also no checks for equality of existing modes.
func (m msgServer) AddMode(goCtx context.Context, msg *types.MsgAddMode) (*types.MsgAddModeResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	modeID := m.Keeper.GetNextModeID(ctx)

	m.Keeper.SetMode(ctx, modeID, msg.Mode)
	m.Keeper.SetRooms(ctx, modeID, types.Rooms{})

	m.Keeper.IncrementNextModeID(ctx)

	return &types.MsgAddModeResponse{Id: modeID}, nil
}

// RemoveMode removes an existing mode from the pool
func (m msgServer) RemoveMode(goCtx context.Context, msg *types.MsgRemoveMode) (*types.MsgRemoveModeResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	m.Keeper.DeleteMode(ctx, msg.Id)

	return &types.MsgRemoveModeResponse{}, nil
}
