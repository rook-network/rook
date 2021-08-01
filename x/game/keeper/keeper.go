package keeper

import (
	"encoding/binary"
	"fmt"

	"github.com/tendermint/tendermint/libs/log"

	"github.com/cmwaters/rook/x/game/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

type (
	Keeper struct {
		cdc      codec.Codec
		storeKey sdk.StoreKey
		// we save all the state transitions throughout the game in memory and
		// then persist the game state to disk during the end blocker so that
		// all the moves in a step appear atomic
		games         map[uint64]*types.Game
		params        map[uint32]*types.Params
		latestVersion uint32
	}
)

func NewKeeper(
	cdc codec.Codec,
	storeKey sdk.StoreKey,
	paramSpace paramtypes.Subspace,
) *Keeper {
	return &Keeper{
		cdc:      cdc,
		storeKey: storeKey,
		games:    make(map[uint64]*types.Game),
		params:   make(map[uint32]*types.Params),
		latestVersion: 0,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

// FlushGameState writes all current game states to disk. This is done in EndBlock
// and is used to calculate the state hash
func (k Keeper) FlushGameState(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	for id, game := range k.games {
		store.Set(types.GameStateKey(id), k.cdc.MustMarshal(game.State()))
	}
}

func (k Keeper) SaveGameOverview(ctx sdk.Context, gameID uint64, gameOverview *types.Overview) {
	store := ctx.KVStore(k.storeKey)
	overviewBytes := k.cdc.MustMarshal(gameOverview)
	store.Set(types.GameOverviewKey(gameID), overviewBytes)
}

func (k Keeper) GetGame(gameID uint64) (*types.Game, error) {
	game, ok := k.games[gameID]
	if !ok {
		return nil, types.ErrGameNotFound
	}
	return game, nil
}

// LoadGames tries to loads all the games persisted to disk.
func (k *Keeper) LoadGames(ctx sdk.Context) {
	// if we've already loaded games before then skip
	if len(k.games) != 0 && len(k.params) != 0 {
		return
	}

	overviews := k.loadAllGameOverviews(ctx)
	states := k.loadAllGameStates(ctx)
	params := k.loadAllParams(ctx)

	for id, overview := range overviews {
		param, ok := params[overview.ParamVersion]
		if !ok {
			continue
		}
		state, ok := states[id]
		if !ok {
			continue
		}
		k.games[id] = types.LoadGame(state, overview, param)
	}

	k.params = params

	// load the latest params version
	store := ctx.KVStore(k.storeKey)
	k.latestVersion = types.ParamsVersionFromKey(store.Get(types.LatestParamsVersionKey))
}

func (k Keeper) UpdateGames(ctx sdk.Context) {
	for _, game := range k.games {
		game.Update()
	}
}

func (k Keeper) SetGameID(ctx sdk.Context, gameID uint64) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.LatestGameIDKey, types.GameIDBytes(gameID))
}

func (k Keeper) GetLatestParams(ctx sdk.Context) *types.Params {
	store := ctx.KVStore(k.storeKey)
	var params *types.Params
	paramBytes := store.Get(types.ParamsKey(k.latestVersion))
	k.cdc.MustUnmarshalJSON(paramBytes, params)
	return params
}

func (k Keeper) LatestParamsVersion() uint32 {
	return k.latestVersion
}

func (k *Keeper) SetLatestParamVersion(ctx sdk.Context, version uint32) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.LatestParamsVersionKey, types.ParamsKey(version))
	k.latestVersion = version
}

func (k Keeper) GetParams(ctx sdk.Context, version uint32) *types.Params {
	store := ctx.KVStore(k.storeKey)
	var params *types.Params
	paramBytes := store.Get(types.ParamsKey(version))
	k.cdc.MustUnmarshalJSON(paramBytes, params)
	return params
}

func (k *Keeper) SetParams(ctx sdk.Context, params types.Params) {
	store := ctx.KVStore(k.storeKey)
	paramBz := k.cdc.MustMarshal(&params)
	store.Set(types.ParamsKey(k.latestVersion+1), paramBz)
	// increment the latest version label
	store.Set(types.LatestParamsVersionKey, types.ParamsKey(k.latestVersion+1))
	k.latestVersion++
	k.params[k.latestVersion] = &params
}

func (k Keeper) DeleteParams(ctx sdk.Context, version uint32) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.ParamsKey(version))
}

// GetNextGameID gets the ID to be used for the next game
func (k Keeper) GetNextGameID(ctx sdk.Context) (uint64, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.LatestGameIDKey)
	if bz == nil {
		return 0, sdkerrors.Wrap(types.ErrGameCountNotSet, "initial proposal ID hasn't been set")
	}
	gameID := binary.BigEndian.Uint64(bz)
	nextGameID := gameID + 1
	// increment the key number
	store.Set(types.LatestGameIDKey, types.GameIDBytes(nextGameID))
	return gameID, nil
}

func (k Keeper) loadAllGameOverviews(ctx sdk.Context) map[uint64]*types.Overview {
	overviews := make(map[uint64]*types.Overview)
	store := ctx.KVStore(k.storeKey)
	iter := store.Iterator(
		types.GameOverviewKey(0),
		types.GameOverviewKey(1<<63-1),
	)
	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		setup := &types.Overview{}
		k.cdc.MustUnmarshal(bz, setup)
		gameID := types.GameIDFromBytes(iter.Key())
		overviews[gameID] = setup
	}
	return overviews
}

func (k Keeper) loadAllGameStates(ctx sdk.Context) map[uint64]*types.State {
	states := make(map[uint64]*types.State)
	store := ctx.KVStore(k.storeKey)
	iter := store.Iterator(
		types.GameStateKey(0),
		types.GameStateKey(1<<63-1),
	)
	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		state := &types.State{}
		k.cdc.MustUnmarshal(bz, state)
		gameID := types.GameIDFromBytes(iter.Key())
		states[gameID] = state
	}
	return states
}

func (k Keeper) loadAllParams(ctx sdk.Context) map[uint32]*types.Params {
	params := make(map[uint32]*types.Params)
	store := ctx.KVStore(k.storeKey)
	iter := store.Iterator(
		types.ParamsKey(0),
		types.ParamsKey(1<<31-1),
	)
	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		param := &types.Params{}
		k.cdc.MustUnmarshal(bz, param)
		version := types.ParamsVersionFromKey(iter.Key())
		params[version] = param
	}
	return params
}
