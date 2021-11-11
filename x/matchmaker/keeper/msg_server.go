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

// Host creates a new game, either a custom or common one, where the host is the only player.
// Games can be public or private. In the case of private, the host needs to specify which accounts
// are allowed to join. Hosting a game will remove the player from any account they might currently be in.
//
// TODO: Hosts can start a room whilst already participating in a game. We should also add a check that prevents this
func (m msgServer) Host(goCtx context.Context, msg *types.MsgHost) (*types.MsgHostResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	time := ctx.BlockTime()
	if msg.Scheduled != nil {
		time = *msg.Scheduled
	}

	// Check if the host is already in a room. If so, remove them from the existing room
	m.Keeper.RemovePlayerFromCurrentRoom(ctx, msg.Host)

	roomID := m.Keeper.GetNextRoomID(ctx)

	var room types.Room
	switch g := msg.Game.(type) {
	case *types.MsgHost_Mode:
		room = types.NewCustomRoom(g.Mode.Config, []string{msg.Host}, msg.Invitees,
			msg.Public, g.Mode.Quorum, g.Mode.Capacity, time)

	case *types.MsgHost_ModeId:
		mode, exists := m.Keeper.GetMode(ctx, g.ModeId)
		if !exists {
			return nil, sdkerrors.Wrapf(types.ErrModeNotFound, "modeID: %d", g.ModeId)
		}
		room = types.NewCommonRoom(g.ModeId, []string{msg.Host}, msg.Invitees,
			msg.Public, mode.Quorum, mode.Capacity, time)

		// if the host is hosting a public common room and none already
		// exists then we declare it as a common room so other participants can find it
		if msg.Public && !m.Keeper.HasCommonRoom(ctx, g.ModeId) {
			m.Keeper.SetCommonRoom(ctx, g.ModeId, roomID)
		}
	}

	m.Keeper.SetRoom(ctx, roomID, room)

	m.Keeper.IncrementNextRoomID(ctx)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId:       roomID,
		AddedPlayers: []string{msg.Host},
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

	err := room.TryAddPlayer(msg.Player)
	if err != nil {
		return nil, err
	}

	// Check if the player is already in a room. If so, remove them from the existing room
	m.Keeper.RemovePlayerFromCurrentRoom(ctx, msg.Player)

	// persist changes to that room
	m.Keeper.SetRoom(ctx, msg.RoomId, room)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId:       msg.RoomId,
		AddedPlayers: []string{msg.Player},
	})

	return &types.MsgJoinResponse{}, nil
}

// Find retrieves the next room that has the same modeID and is public and adds
// the player. If no room can be found, a new room is created with that player
func (m msgServer) Find(goCtx context.Context, msg *types.MsgFind) (*types.MsgFindResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if !m.Keeper.HasMode(ctx, msg.Mode) {
		return nil, sdkerrors.Wrapf(types.ErrModeNotFound, "modeID: %d", msg.Mode)
	}

	roomID, room, exists := m.Keeper.GetCommonRoom(ctx, msg.Mode)

	// if no room exists using that mode then we need to create a new one
	if !exists {
		msgHost := types.NewMsgHostByModeID(msg.Player, []string{}, msg.Mode, true)
		// Host a new game. This will persist the new room, remove the player from an old room,
		// and emit the relevant events
		res, err := m.Host(goCtx, msgHost)
		if err != nil {
			return nil, err
		}

		return &types.MsgFindResponse{RoomId: res.RoomId}, nil
	}

	err := room.TryAddPlayer(msg.Player)
	if err != nil {
		return nil, fmt.Errorf("error adding player to room: %w", err)
	}

	// Check if the player is already in a room. If so, remove them from the existing room
	m.Keeper.RemovePlayerFromCurrentRoom(ctx, msg.Player)

	if room.IsFull() {
		m.Keeper.DetachCommonRoom(ctx, msg.Mode)
	}

	// persist changes to that room
	m.Keeper.SetRoom(ctx, roomID, room)

	ctx.EventManager().EmitTypedEvent(&types.EventRoomUpdated{
		RoomId:       roomID,
		AddedPlayers: []string{msg.Player},
	})

	return &types.MsgFindResponse{RoomId: roomID}, nil
}

// Leave removes the player from their current room if they are in one
func (m msgServer) Leave(goCtx context.Context, msg *types.MsgLeave) (*types.MsgLeaveResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	m.Keeper.RemovePlayerFromCurrentRoom(ctx, msg.Player)
	return &types.MsgLeaveResponse{}, nil
}

// AddMode adds a new mode type to the pool.
// NOTE: This is designed as part of governance but currently anyone can create
// a new mode. There's also no checks for equality of existing modes.
func (m msgServer) AddMode(goCtx context.Context, msg *types.MsgAddMode) (*types.MsgAddModeResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	existingMode, counter := m.Keeper.CheckForMode(ctx, msg.Mode)
	if existingMode != 0 {
		return &types.MsgAddModeResponse{ModeId: existingMode}, nil
	}
	if counter >= types.MaxModes {
		return nil, types.ErrModeCapacityReached
	}

	modeID := m.Keeper.GetNextModeID(ctx)

	m.Keeper.SetMode(ctx, modeID, msg.Mode)

	m.Keeper.IncrementNextModeID(ctx)

	return &types.MsgAddModeResponse{ModeId: modeID}, nil
}

// RemoveMode removes an existing mode from the pool
func (m msgServer) RemoveMode(goCtx context.Context, msg *types.MsgRemoveMode) (*types.MsgRemoveModeResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	m.Keeper.DeleteMode(ctx, msg.Id)

	return &types.MsgRemoveModeResponse{}, nil
}
