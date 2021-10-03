package keeper

import (
	"testing"
	"time"

	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/simapp"
	"github.com/cosmos/cosmos-sdk/store"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"github.com/stretchr/testify/require"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	tmdb "github.com/tendermint/tm-db"

	game "github.com/arcane-systems/rook/x/game/types"
	"github.com/arcane-systems/rook/x/matchmaker/types"
)

var (
	paramskey  = sdk.NewKVStoreKey("storekey")
	paramstkey = sdk.NewTransientStoreKey("transientstorekey")
	blockTime  = time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)
)

func setupKeeper(t testing.TB) (Keeper, sdk.Context) {
	storeKey := sdk.NewKVStoreKey(types.StoreKey)

	db := tmdb.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, sdk.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(paramskey, sdk.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(paramstkey, sdk.StoreTypeTransient, db)
	require.NoError(t, stateStore.LoadLatestVersion())

	encCfg := simapp.MakeTestEncodingConfig()
	params := paramtypes.NewSubspace(encCfg.Marshaler, encCfg.Amino, paramskey, paramstkey, "testsubspace")

	registry := codectypes.NewInterfaceRegistry()
	keeper := NewKeeper(codec.NewProtoCodec(registry), storeKey, params, baseapp.NewMsgServiceRouter())

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, log.NewNopLogger())
	keeper.InitGenesis(ctx, *types.DefaultGenesis())
	return keeper, ctx
}

func TestCreateRoom(t *testing.T) {
	keeper, ctx := setupKeeper(t)

	room := types.NewRoom(game.DefaultConfig(), []string{"a", "b", "c"}, []string{"d"}, true, 5, 6, blockTime)

	roomID := keeper.GetNextRoomID(ctx)
	require.Equal(t, uint64(1), roomID)

	keeper.SetRoom(ctx, roomID, room)
	keeper.IncrementNextRoomID(ctx)

	r, exists := keeper.GetRoom(ctx, roomID)
	require.True(t, exists)
	require.Equal(t, room, r)

	nextRoomID := keeper.GetNextRoomID(ctx)
	require.Equal(t, roomID+1, nextRoomID)

	r, exists = keeper.GetRoom(ctx, nextRoomID)
	require.False(t, exists)
}

func TestCreateModes(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	var roomID uint64 = 1

	mode := types.NewMode(game.DefaultConfig(), 3, 4)
	require.NoError(t, mode.ValidateBasic())

	modeID := keeper.GetNextModeID(ctx)
	require.Equal(t, uint32(1), modeID)

	keeper.SetMode(ctx, modeID, mode)
	keeper.IncrementNextModeID(ctx)

	m1, exists := keeper.GetMode(ctx, modeID)
	require.True(t, exists)
	require.Equal(t, mode, m1)

	nextModeID := keeper.GetNextModeID(ctx)
	require.Equal(t, modeID+1, nextModeID)

	_, exists = keeper.GetMode(ctx, nextModeID)
	require.False(t, exists)

	rooms, exists := keeper.GetRoomsByMode(ctx, modeID)
	require.False(t, exists)
	require.Empty(t, rooms.Ids)

	rooms.Add(roomID)

	keeper.SetRooms(ctx, modeID, rooms)
	rooms, exists = keeper.GetRoomsByMode(ctx, modeID)
	require.True(t, exists)
	require.NotEmpty(t, rooms.Ids)
}

func TestParams(t *testing.T) {
	keeper, ctx := setupKeeper(t)

	// params := keeper.GetParams(ctx)
	// require.Equal(t, types.DefaultParams(), params)

	newParams := types.DefaultParams()
	newParams.PrestartWaitPeriod = time.Duration(5 * time.Second)
	newParams.RoomLifespan = time.Duration(2 * time.Hour)
	keeper.SetParams(ctx, newParams)

	gotParams := keeper.GetParams(ctx)
	require.Equal(t, newParams, gotParams)

}
