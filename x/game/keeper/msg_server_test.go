package keeper_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	"github.com/rook-network/rook/testutil/simapp"
	"github.com/rook-network/rook/x/game/keeper"
	"github.com/rook-network/rook/x/game/types"
)

func TestGame(t *testing.T) {
	dir := t.TempDir()
	app := simapp.New(dir)
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	goCtx := sdk.WrapSDKContext(ctx)
	addrs := simapp.AddTestAddrsIncremental(app, ctx, 3, sdk.NewInt(30000000))
	alice, bob, charles := addrs[0].String(), addrs[1].String(), addrs[2].String()
	config := types.DefaultConfig()
	config.Map.Seed = 123
	config.Map.Width = 10
	config.Map.Height = 10
	config.Initial.Resources.Population = 5
	config.Initial.Resources.Wood = 7
	var id uint64 = 1

	server := keeper.NewMsgServerImpl(app.GameKeeper)
	querier := app.GameKeeper

	latestParamsRequest := &types.QueryParamsRequest{Version: 0}
	paramsResp, err := querier.Params(goCtx, latestParamsRequest)
	require.NoError(t, err)
	require.Equal(t, uint32(1), paramsResp.Version)

	msgCreate := types.NewMsgCreate([]string{alice, bob, charles}, config)
	createResp, err := server.Create(goCtx, msgCreate)
	require.NoError(t, err)
	require.Equal(t, id, createResp.GameId)

	gameRequest := &types.QueryGameByIDRequest{Id: id}
	getGameResp, err := querier.Game(goCtx, gameRequest)
	require.NoError(t, err)
	require.Equal(t, uint32(1), getGameResp.Game.ParamVersion)
	gameMap := types.GenerateMap(config.Map)
	t.Log(gameMap.Print())
	require.Equal(t, gameMap, getGameResp.Game.Map)
	require.Equal(t, types.NewPosition(4, 3), getGameResp.Game.State.Factions[0].Population[0].Position)

	stateRequest := &types.QueryGameStateRequest{Id: id}
	getStateResponse, err := querier.State(goCtx, stateRequest)
	require.Equal(t, uint64(0), getStateResponse.State.Step)
	require.Len(t, getStateResponse.State.Factions, len(addrs))
	require.Empty(t, getStateResponse.State.Gaia)
	for idx, faction := range getStateResponse.State.Factions {
		require.Contains(t, faction.Players, addrs[idx].String())
	}
	require.Equal(t, *getGameResp.Game.State, getStateResponse.State)

	moveRequest := types.NewMsgMove(alice, id, 0, types.Direction_LEFT, 3)
	_, err = server.Move(goCtx, moveRequest)
	require.NoError(t, err)

	querier.UpdateGames(ctx)

	getStateResponse, err = querier.State(goCtx, stateRequest)
	require.NoError(t, err)
	require.Equal(t, uint64(1), getStateResponse.State.Step)
	require.Len(t, getStateResponse.State.Factions[0].Population, 2)

	pop1 := types.NewPopulace(4, types.NewPosition(4, 3), types.Settlement_CAPITAL, false)
	require.Equal(t, pop1, getStateResponse.State.Factions[0].Population[0])

	pop2 := types.NewPopulace(3, types.NewPosition(3, 3), types.Settlement_NONE, false)
	require.Equal(t, pop2, getStateResponse.State.Factions[0].Population[1])

	resources := types.NewResources(6, 6, 8, 7)
	require.Equal(t, resources, getStateResponse.State.Factions[0].Resources)

	buildRequest := types.NewMsgBuild(alice, id, 1, types.Settlement_FARM)
	_, err = server.Build(goCtx, buildRequest)
	require.NoError(t, err)

	moveRequest = types.NewMsgMove(alice, id, 0, types.Direction_UP, 2)
	_, err = server.Move(goCtx, moveRequest)
	require.NoError(t, err)

	querier.UpdateGames(ctx)

	getStateResponse, err = querier.State(goCtx, stateRequest)
	require.NoError(t, err)
	require.Equal(t, uint64(2), getStateResponse.State.Step)

	require.Equal(t, types.Settlement_FARM, getStateResponse.State.Factions[0].Population[1].Settlement)
	resources = types.NewResources(6, 6, 1, 9)
	require.Equal(t, resources, getStateResponse.State.Factions[0].Resources)
	require.Len(t, getStateResponse.State.Factions[0].Population, 3)

}
