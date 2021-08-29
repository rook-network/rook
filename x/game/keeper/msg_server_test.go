package keeper_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	"github.com/cmwaters/rook/testutil/simapp"
	"github.com/cmwaters/rook/x/game/keeper"
	"github.com/cmwaters/rook/x/game/types"
)

func TestGame(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 5, sdk.NewInt(30000000))
	alice, bob, charles := addrs[0].String(), addrs[1].String(), addrs[2].String()
	config := types.DefaultConfig()
	config.Map.Seed = 123

	server := keeper.NewMsgServerImpl(app.GameKeeper)
	querier := app.GameKeeper

	latestParamsRequest := &types.QueryGetParamsRequest{Version: 0} 
	paramsResp, err := querier.Params(goCtx, latestParamsRequest)
	require.NoError(t, err)
	require.Equal(t, uint32(1), paramsResp.Version)

	msgCreate := types.NewMsgCreate([]string{alice, bob, charles}, config)
	createResp, err := server.Create(goCtx, msgCreate)
	require.NoError(t, err)
	require.Equal(t, uint64(1), createResp.GameId)

	gameRequest := &types.QueryGetGameRequest{Id: uint64(1)}
	getGameResp, err := querier.Game(goCtx, gameRequest)
	require.NoError(t, err)
	require.Equal(t, uint64(1), getGameResp.Id)
	require.Equal(t, uint32(1), getGameResp.Overview.ParamVersion)

}
