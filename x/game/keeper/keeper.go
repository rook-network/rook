package keeper

import (
	"fmt"

	"github.com/tendermint/tendermint/libs/log"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/rook-network/rook/x/game/types"
)

type Keeper struct {
	cdc      codec.Codec
	storeKey sdk.StoreKey
	memKey   sdk.StoreKey
}

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

func (k Keeper) CreateGame(ctx sdk.Context, players []string, config types.Config) (uint64, error) {
	if config.Map.Seed == 0 {
		return 0, types.ErrSeedNotSet
	}

	params := k.GetLatestParamsVersion(ctx)

	game, err := types.SetupGame(players, &config, params, ctx.BlockTime())
	if err != nil {
		return 0, err
	}

	gameID, err := k.GetNextGameID(ctx)
	if err != nil {
		return 0, err
	}

	// add the game in memory
	k.SetGame(ctx, gameID, game)

	// add the players to the secondary index
	k.SetPlayersInGame(ctx, players, gameID)

	// save the next game ID
	k.SetNextGameID(ctx, gameID+1)

	// emit the events for the new game
	ctx.EventManager().EmitEvent(types.NewGameEvent(gameID, players, config, params))

	return gameID, nil
}

func (k Keeper) UpdateGames(ctx sdk.Context) {
	memStore := ctx.KVStore(k.memKey)

	// TODO: we should check which versiions of params are still in use and which
	// are not and prune those. Currently we keep all params for eternity
	params := k.GetAllParams(ctx)

	iter := memStore.Iterator(
		types.GameKey(0),
		types.GameKey(1<<63-1),
	)
	for ; iter.Valid(); iter.Next() {
		var game types.Game
		k.cdc.MustUnmarshal(iter.Value(), &game)
		id := types.ParseGameKey(iter.Key())
		p, ok := params[game.ParamVersion]
		if !ok {
			panic("param version for game is missing")
		}
		game.Update(p)
		if finished, victors := game.IsCompleted(ctx.BlockTime(), p); finished {
			memStore.Delete(types.GameKey(id))
			// emit the events for the completed game
			ctx.EventManager().EmitEvent(types.NewFinishedGameEvent(id, victors))
		} else {
			memStore.Set(types.GameKey(id), k.cdc.MustMarshal(&game))
			// emit the events for the updated state
			ctx.EventManager().EmitEvent(types.NewGameUpdatedEvent(id, game.State))
		}
	}
}

func (k Keeper) LeaveGame(ctx sdk.Context, player string) {
	gameID, err := k.GetGameIDByPlayer(ctx, player)
	if err != nil {
		return
	}
	game, err := k.GetGame(ctx, gameID)
	if err != nil {
		ctx.Logger().Error("Error getting game", "err", err)
		return
	}
	game.RemovePlayer(player)
	k.SetGame(ctx, gameID, &game)
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

func (k Keeper) GetGame(ctx sdk.Context, gameID uint64) (types.Game, error) {
	var game types.Game
	memStore := ctx.KVStore(k.memKey)
	g := memStore.Get(types.GameKey(gameID))
	if g == nil {
		return types.Game{}, types.ErrGameNotFound
	}
	k.cdc.MustUnmarshal(g, &game)

	return game, nil
}

func (k Keeper) SetGame(ctx sdk.Context, gameID uint64, game *types.Game) {
	memStore := ctx.KVStore(k.memKey)
	memStore.Set(types.GameKey(gameID), k.cdc.MustMarshal(game))
}

func (k Keeper) DeleteGame(ctx sdk.Context, gameID uint64) {
	store := ctx.KVStore(k.storeKey)
	memStore := ctx.KVStore(k.memKey)

	store.Delete(types.GameKey(gameID))
	memStore.Delete(types.GameStateKey(gameID))
	memStore.Delete(types.GameOverviewKey(gameID))
}

func (k Keeper) SetNextGameID(ctx sdk.Context, gameID uint64) {
	memStore := ctx.KVStore(k.storeKey)
	memStore.Set(types.GameIDKey, types.GameIDBytes(gameID))
}

// GetGameID gets the ID to be used for the next game
func (k Keeper) GetNextGameID(ctx sdk.Context) (uint64, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.GameIDKey)
	if bz == nil {
		return 0, sdkerrors.Wrap(types.ErrGameCountNotSet, "initial proposal ID hasn't been set")
	}
	gameID := types.ParseGameID(bz)
	return gameID, nil
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

func (k Keeper) GetGameIDByPlayer(ctx sdk.Context, player string) (uint64, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.GamePlayerKey(player))
	if len(bz) == 0 {
		return 0, types.ErrPlayerNotInGame
	}
	return types.ParseGameID(bz), nil
}

func (k Keeper) IsPlaying(ctx sdk.Context, player string) bool {
	store := ctx.KVStore(k.storeKey)
	return store.Has(types.GamePlayerKey(player))
}

func (k Keeper) SetPlayersInGame(ctx sdk.Context, players []string, gameID uint64) {
	store := ctx.KVStore(k.storeKey)
	for _, p := range players {
		store.Set(types.GamePlayerKey(p), types.GameIDBytes(gameID))
	}
}

func (k Keeper) RemovePlayersFromGame(ctx sdk.Context, players []string) {
	store := ctx.KVStore(k.storeKey)
	for _, p := range players {
		store.Delete(types.GamePlayerKey(p))
	}
}
