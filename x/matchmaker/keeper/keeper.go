package keeper

import (
	"fmt"

	"github.com/tendermint/tendermint/libs/log"

	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cmwaters/rook/x/matchmaker/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	// this line is used by starport scaffolding # ibc/keeper/import
)

type (
	Keeper struct {
		cdc      codec.Codec
		storeKey sdk.StoreKey
		memKey   sdk.StoreKey
		router   *baseapp.MsgServiceRouter
	}
)

func NewKeeper(
	cdc codec.Codec,
	storeKey,
	memKey sdk.StoreKey,
	router *baseapp.MsgServiceRouter,
) *Keeper {
	return &Keeper{
		cdc:      cdc,
		storeKey: storeKey,
		memKey:   memKey,
		router: router,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) CreateGame(ctx sdk.Context, room types.Room) error {
	msg := room.MsgCreate()

	handler := k.router.Handler(msg)
	if handler == nil {
		return sdkerrors.ErrUnknownRequest.Wrapf("unrecognized message route: %s", sdk.MsgTypeURL(msg))
	}

	return nil
}

func (k Keeper) GetRoom(ctx sdk.Context, roomID uint64) (types.Room, bool) {
	room := types.Room{}
	store := ctx.KVStore(k.storeKey)

	bz := store.Get(types.RoomKey(roomID))
	if bz == nil {
		return room, false
	}

	k.cdc.MustUnmarshal(bz, &room)
	return room, true
}

func (k Keeper) SetRoom(ctx sdk.Context, roomID uint64, room types.Room) {
	store := ctx.KVStore(k.storeKey)

	bz := k.cdc.MustMarshal(&room)

	store.Set(types.RoomKey(roomID), bz)
}

func (k Keeper) DeleteRoom(ctx sdk.Context, roomID uint64) {
	store := ctx.KVStore(k.storeKey)

	store.Delete(types.RoomKey(roomID))
}

func (k Keeper) GetCommonRoom(ctx sdk.Context, modeID uint32) (types.CommonRoom, bool) {
	room := types.CommonRoom{}
	store := ctx.KVStore(k.storeKey)

	bz := store.Get(types.CommonRoomKey(modeID))
	if bz == nil {
		return room, false
	}

	k.cdc.MustUnmarshal(bz, &room)
	return room, true
}

func (k Keeper) SetCommonRoom(ctx sdk.Context, roomID uint64, room types.CommonRoom) {
	store := ctx.KVStore(k.storeKey)

	bz := k.cdc.MustMarshal(&room)

	store.Set(types.RoomKey(roomID), bz)
}

// NOTE: This function might not be necessary
func (k Keeper) DeleteCommonRoom(ctx sdk.Context, modeID uint32) {
	store := ctx.KVStore(k.storeKey)

	store.Delete(types.CommonRoomKey(modeID))
}

func (k Keeper) GetNextRoomID(ctx sdk.Context) uint64 {
	store := ctx.KVStore(k.storeKey)

	return types.ParseRoomID(store.Get(types.RoomIDKey))
}

func (k Keeper) IncrementNextRoomID(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)

	currentRoomID := types.ParseRoomID(store.Get(types.RoomIDKey))

	nextRoomIDBytes := types.RoomIDBytes(currentRoomID + 1)

	store.Set(types.RoomIDKey, nextRoomIDBytes)
}

func (k Keeper) GetNextModeID(ctx sdk.Context) uint32 {
	store:= ctx.KVStore(k.storeKey)

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

func (k Keeper) DeleteMode(ctx sdk.Context, modeID uint32) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.ModeKey(modeID))
	store.Delete(types.CommonRoomKey(modeID))
}
