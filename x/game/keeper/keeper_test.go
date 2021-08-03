package keeper

import (
	"testing"

	"github.com/cmwaters/rook/x/game/types"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/store"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	tmdb "github.com/tendermint/tm-db"
)

func setupKeeper(t testing.TB) (*Keeper, sdk.Context) {
	storeKey := sdk.NewKVStoreKey(types.StoreKey)
	memKey := sdk.NewMemoryStoreKeys(types.MemStoreKey)

	db := tmdb.NewMemDB()
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
	keeper.SetParams(ctx, params)

	require.Equal(t, uint32(1), keeper.GetLatestParamsVersion(ctx))
}
