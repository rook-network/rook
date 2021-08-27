package keeper_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	"github.com/cmwaters/rook/testutil/simapp"
	game "github.com/cmwaters/rook/x/game/types"
	"github.com/cmwaters/rook/x/matchmaker/keeper"
	"github.com/cmwaters/rook/x/matchmaker/types"
)

func TestMatchmaker(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 5, sdk.NewInt(30000000))
	alice, bob, charles, david, emma := addrs[0].String(), addrs[1].String(), addrs[2].String(), addrs[3].String(), addrs[4].String()

	server := keeper.NewMsgServerImpl(app.MatchmakerKeeper)
	querier := app.MatchmakerKeeper

	firstMode := types.NewMode(game.DefaultConfig(), 3, 4)
	require.NoError(t, firstMode.ValidateBasic())
	msgAddMode := types.NewMsgAddMode(alice, firstMode)

	addModeResp, err := server.AddMode(goCtx, msgAddMode)
	require.NoError(t, err)
	require.NotNil(t, addModeResp)
	require.Equal(t, uint32(1), addModeResp.Id)

	m, exists := querier.GetMode(ctx, addModeResp.Id)
	require.True(t, exists)
	require.Equal(t, firstMode, m)

	queryModes := &types.QueryGetModesRequest{}
	queryModesResp, err := querier.Modes(goCtx, queryModes)
	require.NoError(t, err)
	require.Len(t, queryModesResp.Modes, 1)
	require.Equal(t, &firstMode, queryModesResp.Modes[addModeResp.Id])

	msgHost := types.NewMsgHostByModeID(bob, []string{alice, charles}, 1, true)
	require.NoError(t, msgHost.ValidateBasic())

	hostResp, err := server.Host(goCtx, msgHost)
	require.NoError(t, err)
	require.NotNil(t, hostResp)
	require.Equal(t, uint64(1), hostResp.RoomId)

	queryRoom := &types.QueryGetRoomRequest{Id: hostResp.RoomId}
	queryRoomResp, err := querier.Room(goCtx, queryRoom)
	require.NoError(t, err)
	room := queryRoomResp.Room
	require.Equal(t, []string{bob}, room.Players)
	require.Equal(t, []string{alice, charles}, room.Pending)
	require.False(t, room.HasQuorum())
	require.False(t, room.IsFull())

	msgJoin := types.NewMsgJoin(david, hostResp.RoomId)
	_, err = server.Join(goCtx, msgJoin)
	require.NoError(t, err)

	msgJoin2 := types.NewMsgJoin(alice, hostResp.RoomId)
	_, err = server.Join(goCtx, msgJoin2)
	require.NoError(t, err)

	queryRoomResp2, err := querier.Room(goCtx, queryRoom)
	require.NoError(t, err)
	room2 := queryRoomResp2.Room
	require.Equal(t, []string{bob, david, alice}, room2.Players)
	require.True(t, room2.HasQuorum())

	_, err = server.Join(goCtx, msgJoin2)
	require.Error(t, err)
	require.Contains(t, err.Error(), types.ErrPlayerAlreadyInRoom.Error())

	msgFind := types.NewMsgFind(emma, addModeResp.Id)
	findResp, err := server.Find(goCtx, msgFind)
	require.NoError(t, err)
	require.Equal(t, hostResp.RoomId, findResp.RoomId)

	querier.UpdateRooms(ctx)

	queryRoomResp, err = querier.Room(goCtx, queryRoom)
	require.Error(t, err)
	require.Contains(t, err.Error(), types.ErrRoomNotFound.Error())

	queryParamsResp, err := querier.Params(goCtx, &types.QueryGetParamsRequest{})
	require.NoError(t, err)
	require.Equal(t, types.DefaultParams(), *queryParamsResp.Params)
}
