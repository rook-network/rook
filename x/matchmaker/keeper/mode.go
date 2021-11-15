package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/tendermint/tendermint/crypto/tmhash"

	"github.com/rook-network/rook/x/matchmaker/types"
)

func (k Keeper) GetAllModes(ctx sdk.Context) []types.Mode {
	modes := make([]types.Mode, 0)
	store := ctx.KVStore(k.storeKey)

	modeIter := store.Iterator(
		types.ModeKey(0),
		types.ModeKey(1<<31-1),
	)
	for ; modeIter.Valid(); modeIter.Next() {
		var mode types.Mode
		k.cdc.MustUnmarshal(modeIter.Value(), &mode)
		modes = append(modes, mode)
	}

	return modes
}

// CheckForMode uses hashes to check that a mode is unique. If it is not it returns the
// modeID of the existing mode. CheckForMode also keeps a count of the amount of current modes there are
func (k Keeper) CheckForMode(ctx sdk.Context, mode types.Mode) (uint32, int) {
	store := ctx.KVStore(k.storeKey)

	modeHashMap := make(map[string]struct{})
	counter := 0

	modeIter := store.Iterator(
		types.ModeKey(0),
		types.ModeKey(1<<31-1),
	)
	for ; modeIter.Valid(); modeIter.Next() {
		counter++
		modeHash := tmhash.Sum(modeIter.Value())
		if _, exists := modeHashMap[string(modeHash)]; exists {
			return types.ParseModeKey(modeIter.Key()), 0
		}
		modeHashMap[string(modeHash)] = struct{}{}
	}
	return 0, counter
}

func (k Keeper) GetNextModeID(ctx sdk.Context) uint32 {
	store := ctx.KVStore(k.storeKey)

	return types.ParseModeID(store.Get(types.ModeIDKey))
}

func (k Keeper) IncrementNextModeID(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)

	currentModeID := types.ParseModeID(store.Get(types.ModeIDKey))

	nextModeIDBytes := types.ModeIDBytes(currentModeID + 1)

	store.Set(types.ModeIDKey, nextModeIDBytes)
}

func (k Keeper) SetMode(ctx sdk.Context, modeID uint32, mode types.Mode) {
	store := ctx.KVStore(k.storeKey)

	bz := k.cdc.MustMarshal(&mode)

	store.Set(types.ModeKey(modeID), bz)
}

func (k Keeper) GetMode(ctx sdk.Context, modeID uint32) (types.Mode, bool) {
	var mode types.Mode
	store := ctx.KVStore(k.storeKey)

	bz := store.Get(types.ModeKey(modeID))
	if bz == nil {
		return mode, false
	}

	k.cdc.MustUnmarshal(bz, &mode)
	return mode, true
}

func (k Keeper) HasMode(ctx sdk.Context, modeID uint32) bool {
	store := ctx.KVStore(k.storeKey)
	return store.Has(types.ModeKey(modeID))
}

func (k Keeper) DeleteMode(ctx sdk.Context, modeID uint32) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.ModeKey(modeID))
	store.Delete(types.CommonRoomKey(modeID))
}
