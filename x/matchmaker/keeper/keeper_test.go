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

	game "github.com/cmwaters/rook/x/game/types"
	"github.com/cmwaters/rook/x/matchmaker/types"
)

var (
	paramskey  = sdk.NewKVStoreKey("storekey")
	paramstkey = sdk.NewTransientStoreKey("transientstorekey")
	blockTime  = time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC)
)

func setupKeeper(t testing.TB) (*Keeper, sdk.Context) {
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
