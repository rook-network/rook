package keeper

import (
	"testing"

	"github.com/cmwaters/rook/x/game/types"
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
)

var (
	paramskey  = sdk.NewKVStoreKey("storekey")
	paramstkey = sdk.NewTransientStoreKey("transientstorekey")
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
	keeper := NewKeeper(codec.NewProtoCodec(registry), storeKey, params)

	ctx := sdk.NewContext(stateStore, tmproto.Header{}, false, log.NewNopLogger())
	return keeper, ctx
}
