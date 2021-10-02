package keeper

import (
	"encoding/binary"
	"fmt"

	"github.com/tendermint/tendermint/libs/log"

	"github.com/cmwaters/rook/x/game/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

type (
	Keeper struct {
		cdc      codec.Codec
		storeKey sdk.StoreKey
		memKey   sdk.StoreKey
	}
)

func NewKeeper(
	cdc codec.Codec,
	storeKey,
	memKey sdk.StoreKey,
) Keeper {
	return Keeper{
		cdc:      cdc,
		storeKey: storeKey,
		memKey:   memKey,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

// LoadInMemory loads all the games persisted to disk in to memory. This should
// only be done once on startup
func (k *Keeper) LoadInMemory(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	memStore := ctx.KVStore(k.memKey)

	iter := store.Iterator(nil, nil)
	for ; iter.Valid(); iter.Next() {
		memStore.Set(iter.Key(), iter.Value())
	}
}

// FlushGameState writes all current game states to disk. This is done in EndBlock
// and is used to calculate the state hash
func (k Keeper) FlushGameStates(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	memStore := ctx.KVStore(k.memKey)

	iter := memStore.Iterator(
		types.GameStateKey(0),
		types.GameStateKey(1<<63-1),
	)
	for ; iter.Valid(); iter.Next() {
		store.Set(iter.Key(), iter.Value())
	}
}

func (k Keeper) SetGameOverview(ctx sdk.Context, gameID uint64, gameOverview *types.Overview) {
	store := ctx.KVStore(k.storeKey)
	memStore := ctx.KVStore(k.memKey)
	overviewBytes := k.cdc.MustMarshal(gameOverview)
	store.Set(types.GameOverviewKey(gameID), overviewBytes)
	memStore.Set(types.GameOverviewKey(gameID), overviewBytes)
}

func (k Keeper) GetGameOverview(ctx sdk.Context, gameID uint64) (types.Overview, error) {
	memStore := ctx.KVStore(k.memKey)
	var overview types.Overview
	o := memStore.Get(types.GameOverviewKey(gameID))
	if o == nil {
		return types.Overview{}, types.ErrGameNotFound
	}
	k.cdc.MustUnmarshal(o, &overview)
	return overview, nil
}

func (k Keeper) SetGameState(ctx sdk.Context, gameID uint64, state *types.State) {
	memStore := ctx.KVStore(k.memKey)
	memStore.Set(types.GameStateKey(gameID), k.cdc.MustMarshal(state))
}

func (k Keeper) GetGameState(ctx sdk.Context, gameID uint64) (types.State, error) {
	memStore := ctx.KVStore(k.memKey)
	var state types.State
	s := memStore.Get(types.GameStateKey(gameID))
	if s == nil {
		return types.State{}, types.ErrGameNotFound
	}
	k.cdc.MustUnmarshal(s, &state)
	return state, nil
}

func (k Keeper) GetGame(ctx sdk.Context, gameID uint64) (*types.Game, error) {
	var (
		overview types.Overview
		state    types.State
		params   types.Params
	)
	memStore := ctx.KVStore(k.memKey)
	o := memStore.Get(types.GameOverviewKey(gameID))
	if o == nil {
		return nil, types.ErrGameNotFound
	}
	s := memStore.Get(types.GameStateKey(gameID))
	k.cdc.MustUnmarshal(o, &overview)
	p := memStore.Get(types.ParamsKey(overview.ParamVersion))
	if p == nil {
		return nil, types.ErrParamsNotFound
	}
	k.cdc.MustUnmarshal(s, &state)
	k.cdc.MustUnmarshal(p, &params)

	return types.NewGame(&overview, &state, &params), nil
}

func (k Keeper) UpdateGames(ctx sdk.Context) {
	memStore := ctx.KVStore(k.memKey)

	params := k.GetAllParams(ctx)

	iter := memStore.Iterator(
		types.GameOverviewKey(0),
		types.GameOverviewKey(1<<63-1),
	)
	for ; iter.Valid(); iter.Next() {
		var (
			overview types.Overview
			state    types.State
		)
		k.cdc.MustUnmarshal(iter.Value(), &overview)
		id := types.ParseGameID(iter.Key())
		k.cdc.MustUnmarshal(memStore.Get(types.GameStateKey(id)), &state)
		p, ok := params[overview.ParamVersion]
		if !ok {
			panic("param version for game missing")
		}
		game := types.NewGame(&overview, &state, p)
		game.Update()
		memStore.Set(types.GameStateKey(id), k.cdc.MustMarshal(game.State()))
	}
}

func (k Keeper) SetGameID(ctx sdk.Context, gameID uint64) {
	memStore := ctx.KVStore(k.storeKey)
	memStore.Set(types.GameIDKey, types.GameIDBytes(gameID))
}

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

// GetGameID gets the ID to be used for the next game
func (k Keeper) GetGameID(ctx sdk.Context) (uint64, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.GameIDKey)
	if bz == nil {
		return 0, sdkerrors.Wrap(types.ErrGameCountNotSet, "initial proposal ID hasn't been set")
	}
	gameID := binary.BigEndian.Uint64(bz)
	return gameID, nil
}

func (k Keeper) GetAllParams(ctx sdk.Context) map[uint32]*types.Params {
	params := make(map[uint32]*types.Params)
	memStore := ctx.KVStore(k.memKey)
	iter := memStore.Iterator(
		types.ParamsKey(0),
		types.ParamsKey(1<<31-1),
	)
	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		param := &types.Params{}
		k.cdc.MustUnmarshal(bz, param)
		version := types.ParseParamsVersion(iter.Key())
		params[version] = param
	}
	return params
}
