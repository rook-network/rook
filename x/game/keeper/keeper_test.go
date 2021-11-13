package keeper

import (
	"testing"

	"github.com/arcane-systems/rook/x/game/types"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/store"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	dbm "github.com/tendermint/tm-db"
)

func setupKeeper(t testing.TB) (Keeper, sdk.Context) {
	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memKey := sdk.NewMemoryStoreKeys(types.MemStoreKey)

	db := dbm.NewMemDB()
	stateStore := store.NewCommitMultiStore(db)
	stateStore.MountStoreWithDB(storeKey, sdk.StoreTypeIAVL, db)
	stateStore.MountStoreWithDB(memKey[types.MemStoreKey], sdk.StoreTypeMemory, db)
	require.NoError(t, stateStore.LoadLatestVersion())

	registry := codectypes.NewInterfaceRegistry()
	keeper := NewKeeper(codec.NewProtoCodec(registry), storeKey, memKey[types.MemStoreKey])

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, log.NewNopLogger())
	return keeper, ctx
}

func TestParams(t *testing.T) {
	keeper, ctx := setupKeeper(t)

	keeper.SetParamsVersion(ctx, 0)

	params := types.DefaultParams()
	version := keeper.SetParams(ctx, params)

	require.Equal(t, version, keeper.GetLatestParamsVersion(ctx))

	gotParams, err := keeper.GetParams(ctx, version)
	require.NoError(t, err)
	require.Equal(t, params, gotParams)

	nextParams := types.DefaultParams()
	nextParams.ConstructionCost[1] = types.NewResources(8, 10, 5, 0)
	nextVersion := keeper.SetParams(ctx, nextParams)
	require.Equal(t, version+1, nextVersion)

	require.Equal(t, nextVersion, keeper.GetLatestParamsVersion(ctx))
	gotParams = keeper.GetLatestParams(ctx)
	require.Equal(t, nextParams, gotParams)
}
