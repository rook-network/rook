package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/arcane-systems/rook/x/game/types"
)

func (k Keeper) GetLatestParams(ctx sdk.Context) types.Params {
	memStore := ctx.KVStore(k.memKey)
	var params types.Params
	paramBytes := memStore.Get(types.ParamsKey(k.GetLatestParamsVersion(ctx)))
	k.cdc.MustUnmarshal(paramBytes, &params)
	return params
}

func (k Keeper) GetLatestParamsVersion(ctx sdk.Context) uint32 {
	memStore := ctx.KVStore(k.memKey)
	return types.ParseParamsVersion(memStore.Get(types.ParamsVersionKey))
}

func (k *Keeper) SetParamsVersion(ctx sdk.Context, version uint32) {
	memStore := ctx.KVStore(k.memKey)
	memStore.Set(types.ParamsVersionKey, types.ParamsKey(version))
}

func (k Keeper) GetParams(ctx sdk.Context, version uint32) (types.Params, error) {
	store := ctx.KVStore(k.memKey)
	var params types.Params
	paramBytes := store.Get(types.ParamsKey(version))
	if paramBytes == nil {
		return types.Params{}, types.ErrParamsNotFound
	}
	k.cdc.MustUnmarshal(paramBytes, &params)
	return params, nil
}

// SetParams persists params both to memory and disk
func (k *Keeper) SetParams(ctx sdk.Context, params types.Params) uint32 {
	memStore := ctx.KVStore(k.memKey)
	store := ctx.KVStore(k.storeKey)
	paramBz := k.cdc.MustMarshal(&params)
	version := k.GetLatestParamsVersion(ctx)
	memStore.Set(types.ParamsKey(version+1), paramBz)
	memStore.Set(types.ParamsVersionKey, types.ParamsKey(version+1))
	store.Set(types.ParamsKey(version+1), paramBz)
	store.Set(types.ParamsVersionKey, types.ParamsKey(version+1))
	return version + 1
}

func (k Keeper) DeleteParams(ctx sdk.Context, version uint32) {
	memStore := ctx.KVStore(k.memKey)
	store := ctx.KVStore(k.storeKey)
	memStore.Delete(types.ParamsKey(version))
	store.Delete(types.ParamsKey(version))
}

func (k Keeper) GetAllParams(ctx sdk.Context) map[uint32]types.Params {
	params := make(map[uint32]types.Params)
	memStore := ctx.KVStore(k.memKey)
	iter := memStore.Iterator(
		types.ParamsKey(0),
		types.ParamsKey(1<<31-1),
	)
	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		param := types.Params{}
		k.cdc.MustUnmarshal(bz, &param)
		version := types.ParseParamsVersion(iter.Key())
		params[version] = param
	}
	return params
}
