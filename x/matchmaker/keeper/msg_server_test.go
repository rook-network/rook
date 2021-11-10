package keeper_test

import (
	"testing"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	"github.com/arcane-systems/rook/testutil/simapp"
	game "github.com/arcane-systems/rook/x/game/types"
	"github.com/arcane-systems/rook/x/matchmaker/keeper"
	"github.com/arcane-systems/rook/x/matchmaker/types"
)

func TestMatchmakerHostAndJoinPublicRoom(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 5, sdk.NewInt(30000000))
	alice, bob, charles, david, emma := addrs[0].String(), addrs[1].String(), addrs[2].String(), addrs[3].String(), addrs[4].String()

	server := keeper.NewMsgServerImpl(app.MatchmakerKeeper)
	querier := app.MatchmakerKeeper

	// check that the params are equal to the default ones
	params := app.MatchmakerKeeper.GetParams(ctx)
	require.Equal(t, types.DefaultParams(), params)

	// get the initial mode and mode id
	queryModes := &types.QueryGetModesRequest{}
	queryModesResp, err := querier.Modes(goCtx, queryModes)
	require.NoError(t, err)
	require.Len(t, queryModesResp.Modes, 1)

	// create host message and submit it to the server
	msgHost := types.NewMsgHostByModeID(bob, []string{alice, charles}, queryModesResp.Modes[0].Id, true)
	require.NoError(t, msgHost.ValidateBasic())

	hostResp, err := server.Host(goCtx, msgHost)
	require.NoError(t, err)
	require.NotNil(t, hostResp)
	require.Equal(t, uint64(1), hostResp.RoomId)

	// should generate a new room if bob tries to host again
	hostResp2, err := server.Host(goCtx, msgHost)
	require.NoError(t, err)
	require.Equal(t, uint64(2), hostResp2.RoomId)

	// the initial room should no longer exist
	_, err = querier.Room(goCtx, &types.QueryGetRoomRequest{Id: hostResp.RoomId})
	require.Error(t, err)

	// check that the room now exists
	queryRoom := &types.QueryGetRoomRequest{Id: hostResp2.RoomId}
	queryRoomResp, err := querier.Room(goCtx, queryRoom)
	require.NoError(t, err)
	room := queryRoomResp.Room
	require.Equal(t, []string{bob}, room.Players)
	require.Equal(t, []string{alice, charles}, room.Pending)
	require.False(t, room.HasQuorum())
	require.False(t, room.IsFull())

	// two more players join the new room
	msgJoin := types.NewMsgJoin(david, hostResp2.RoomId)
	_, err = server.Join(goCtx, msgJoin)
	require.NoError(t, err)
	msgJoin2 := types.NewMsgJoin(alice, hostResp2.RoomId)
	_, err = server.Join(goCtx, msgJoin2)
	require.NoError(t, err)

	// check that the room updated accordingly
	queryRoomResp2, err := querier.Room(goCtx, queryRoom)
	require.NoError(t, err)
	room2 := queryRoomResp2.Room
	require.Equal(t, []string{bob, david, alice}, room2.Players)
	require.Equal(t, []string{charles}, room2.Pending)
	require.True(t, room2.HasQuorum())

	// alice tries to join the same room again but should return an error
	_, err = server.Join(goCtx, msgJoin2)
	require.Error(t, err)
	require.Contains(t, err.Error(), types.ErrPlayerAlreadyInRoom.Error())

	// emma tries to find a game with the same mode.
	msgFind := types.NewMsgFind(emma, queryModesResp.Modes[0].Id)
	findResp, err := server.Find(goCtx, msgFind)
	require.NoError(t, err)
	require.Equal(t, hostResp2.RoomId, findResp.RoomId)

	// check that the room updated accordingly and is full
	queryRoomResp2, err = querier.Room(goCtx, queryRoom)
	require.NoError(t, err)
	require.Equal(t, []string{bob, david, alice, emma}, queryRoomResp2.Room.Players)
	require.Equal(t, []string{charles}, queryRoomResp2.Room.Pending)
	require.True(t, queryRoomResp2.Room.IsFull())

	// Charles tries to join but the room is full
	msgJoin3 := types.NewMsgJoin(charles, hostResp2.RoomId)
	_, err = server.Join(goCtx, msgJoin3)
	require.Error(t, err)
	require.Contains(t, err.Error(), types.ErrRoomIsFull.Error())

	// now we run the end blocker and update all the rooms. As this room is full
	// it should be cleared and a game should have started
	querier.UpdateRooms(ctx)

	// NOTE: In the future we may want to keep the room around whilst the game is playing
	// so that players can't join another room and so that when the game is over they can
	// automatically return to the same room
	queryRoomResp, err = querier.Room(goCtx, queryRoom)
	require.Error(t, err)
	require.Contains(t, err.Error(), types.ErrRoomNotFound.Error())

	// change the params
	newParams := types.DefaultParams()
	newParams.PrestartWaitPeriod = time.Duration(5 * time.Second)
	app.MatchmakerKeeper.SetParams(ctx, newParams)

	// check the params have been updated
	queryParamsResp, err := querier.Params(goCtx, &types.QueryGetParamsRequest{})
	require.NoError(t, err)
	require.Equal(t, newParams, queryParamsResp.Params)
}

func TestMatchmakerInvitationsToPrivateGame(t *testing.T) {

}

func TestMatchmakerAddAndRemoveModes(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 5, sdk.NewInt(30000000))
	alice := addrs[0].String()

	server := keeper.NewMsgServerImpl(app.MatchmakerKeeper)
	querier := app.MatchmakerKeeper

	// check that the genesis state is correct
	genState := app.MatchmakerKeeper.ExportGenesis(ctx)
	require.Equal(t, types.DefaultGenesis(), genState)
	require.Len(t, genState.InitialModes, 1)

	// Query all the current modes
	getModeResp, err := querier.Modes(goCtx, &types.QueryGetModesRequest{})
	require.NoError(t, err)
	// There should just be a single mode from genesis
	require.Equal(t, genState.InitialModes[0], getModeResp.Modes[0].Mode)
	require.Equal(t, genState.NextModeId, getModeResp.Modes[0].Id+1)

	newMode := types.NewMode(game.DefaultConfig(), 3, 4)
	require.NoError(t, newMode.ValidateBasic())
	msgAddMode := types.NewMsgAddMode(alice, newMode)

	// adds another mode to matchmaker (there should be two in total now)
	addModeResp, err := server.AddMode(goCtx, msgAddMode)
	require.NoError(t, err)
	require.NotNil(t, addModeResp)
	require.Equal(t, uint32(2), addModeResp.Id)

	// gets the recently added mode
	m, exists := querier.GetMode(ctx, addModeResp.Id)
	require.True(t, exists)
	require.Equal(t, newMode, m) // check that it is the same

	// Query all the modes
	queryModes := &types.QueryGetModesRequest{}
	queryModesResp, err := querier.Modes(goCtx, queryModes)
	require.NoError(t, err)
	require.Len(t, queryModesResp.Modes, 2)

	msgRemoveMode := &types.MsgRemoveMode{
		Authority: alice, // TODO: In the future this should be the governance module only
		Id:        queryModesResp.Modes[0].Id,
	}

	// Remove the first mode
	_, err = server.RemoveMode(goCtx, msgRemoveMode)
	require.NoError(t, err)
	// check thta the mode no longer exists
	_, exists = querier.GetMode(ctx, queryModesResp.Modes[0].Id)
	require.False(t, exists)

}
