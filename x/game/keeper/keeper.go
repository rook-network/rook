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
		cdc        codec.Marshaler
		storeKey   sdk.StoreKey
		// we save all the state transitions throughout the game in memory and
		// then persist the game state to disk during the end blocker so that
		// all the moves in a step appear atomic
		games      map[uint64]*types.Game
		paramSpace paramtypes.Subspace
	}
)

func NewKeeper(
	cdc codec.Marshaler,
	storeKey sdk.StoreKey,
	paramSpace paramtypes.Subspace,
) *Keeper {
	return &Keeper{
		cdc:        cdc,
		storeKey:   storeKey,
		games:      make(map[uint64]*types.Game),
		paramSpace: paramSpace,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) GetGame(ctx sdk.Context, gameID uint64) (*types.State, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(GameKey(gameID))
	state := &types.State{}
	err := k.cdc.UnmarshalBinaryBare(bz, state)
	if err != nil {
		return nil, err
	}
	return state, nil
}

// FlushGames writes all current game states to disk. This is done in EndBlock
// and is used to calculate the state hash
func (k Keeper) FlushGames(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	for id, game := range k.games {
		store.Set(GameKey(id), k.cdc.MustMarshalBinaryBare(game.State()))
	}
}

// LoadGames loads all the games persisted to disk.
func (k Keeper) LoadGames(ctx sdk.Context) error {
	store := ctx.KVStore(k.storeKey)
	iter := store.Iterator(GameKey(1), nil)

	for ; iter.Valid(); iter.Next() {
		bz := iter.Value()
		state := &types.State{}
		err := k.cdc.UnmarshalBinaryBare(bz, state)
		if err != nil {
			return err
		}
		gameID := GameKeyFromBytes(iter.Key())
		k.games[gameID] = types.NewGameFromState(state)
	}
	return nil
}

func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	var params types.Params
	k.paramSpace.Get(ctx, types.ParamsStoreKey, &params)
	return params
}

func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.paramSpace.Set(ctx, types.ParamsStoreKey, &params)
}

// GetNextGameID gets the ID to be used for the next game
func (k Keeper) GetNextGameID(ctx sdk.Context) (proposalID uint64, err error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.GameIDKey)
	if bz == nil {
		return 0, sdkerrors.Wrap(types.ErrGameCountNotSet, "initial proposal ID hasn't been set")
	}

	gameID := GameKeyFromBytes(bz)

	// increment the key number
	store.Set(types.GameIDKey, GameKey(gameID+1))
	return gameID, nil
}

// GetProposalIDBytes returns the byte representation of the proposalID
func GameKey(gameID uint64) []byte {
	gameIDBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(gameIDBytes, gameID)
	return gameIDBytes
}

// GetProposalIDFromBytes returns proposalID in uint64 format from a byte array
func GameKeyFromBytes(bz []byte) uint64 {
	return binary.BigEndian.Uint64(bz)
}
