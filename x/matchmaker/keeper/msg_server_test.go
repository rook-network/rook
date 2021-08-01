package keeper_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/cmwaters/rook/testutil/simapp"
	"github.com/cmwaters/rook/x/matchmaker/keeper"
	"github.com/cmwaters/rook/x/matchmaker/types"
	game "github.com/cmwaters/rook/x/game/types"
)

func TestMatchmaker(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 5, sdk.NewInt(30000000))
	alice, bob, charles := addrs[0].String(), addrs[1].String(), addrs[2].String()

	server := keeper.NewMsgServerImpl(app.MatchmakerKeeper)
	querier := app.MatchmakerKeeper

	firstMode := types.NewMode(game.DefaultConfig(), 3, 4)
	require.NoError(t, firstMode.ValidateBasic())
	msgAddMode := types.NewMsgAddMode(alice, firstMode)

	addModeResp, err := server.AddMode(goCtx, msgAddMode)
	require.NoError(t, err)
	require.NotNil(t, addModeResp)
	require.Equal(t, uint32(1), addModeResp.Id)

	queryModes := &types.QueryGetModesRequest{}
	queryModesResp, err := querier.Modes(goCtx, queryModes)
	require.NoError(t, err)
	require.Len(t, queryModesResp.Modes, 1)
	require.Equal(t, firstMode, queryModesResp.Modes[0])

	msgHost := types.NewMsgHostByModeID(bob, []string{alice, charles}, 1, true)
	require.NoError(t, msgHost.ValidateBasic())

	hostResp, err := server.Host(goCtx, msgHost)
	require.NoError(t, err)
	require.NotNil(t, hostResp)
	require.Equal(t, uint64(1), hostResp.RoomId)



	// msgHost := types.NewMsgHost(alice, []string{bob, charles}, )
	// server.Host(ctx, )

}