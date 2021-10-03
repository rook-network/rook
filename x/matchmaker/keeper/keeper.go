package keeper

import (
	"fmt"

	"github.com/tendermint/tendermint/libs/log"

	"github.com/arcane-systems/rook/x/matchmaker/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	// this line is used by starport scaffolding # ibc/keeper/import
)

type (
	Keeper struct {
		cdc      codec.Codec
		params   paramtypes.Subspace
		storeKey sdk.StoreKey
		router   *baseapp.MsgServiceRouter
	}
)

func NewKeeper(
	cdc codec.Codec,
	storeKey sdk.StoreKey,
	paramSpace paramtypes.Subspace,
	router *baseapp.MsgServiceRouter,
) Keeper {
	if !paramSpace.HasKeyTable() {
		paramSpace = paramSpace.WithKeyTable(types.ParamKeyTable())
	}

	return Keeper{
		cdc:      cdc,
		storeKey: storeKey,
		params:   paramSpace,
		router:   router,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) CreateGame(ctx sdk.Context, room types.Room) {
	msg := room.MsgCreate()

	handler := k.router.Handler(msg)
	if handler == nil {
		panic(fmt.Sprintf("unrecognized message route to create game: %s", sdk.MsgTypeURL(msg)))
	}

	res, err := handler(ctx, msg)
	if err != nil {
		panic(err)
	}

	// emit the events from creating the game
	events := res.Events
	sdkEvents := make([]sdk.Event, 0, len(events))
	for i := 0; i < len(events); i++ {
		sdkEvents = append(sdkEvents, sdk.Event(events[i]))
	}
	ctx.EventManager().EmitEvents(sdkEvents)
}

// UpdateRooms loops through all rooms and performs the following:
// - Starts games that have full capacity
// - Starts games for rooms who have reached quorum and have exceeded the
// prestart_wait_period
// - Removes rooms that never reached the quorum within the room_lifespan
func (k Keeper) UpdateRooms(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	now := ctx.BlockTime()
	params := k.GetParams(ctx)

	roomIter := store.Iterator(
		types.RoomKey(0),
		types.RoomKey(1<<63-1),
	)
	for ; roomIter.Valid(); roomIter.Next() {
		var room types.Room
		k.cdc.MustUnmarshal(roomIter.Value(), &room)

		roomID := types.ParseRoomKey(roomIter.Key())

		switch t := room.Time.(type) {
		case *types.Room_Created:
			if room.IsFull() {
				k.CreateGame(ctx, room)
				k.DeleteRoom(ctx, roomID)
				k.RemoveRoomFromModePool(ctx, room.ModeId, roomID)
			} else if room.HasQuorum() {
				room.ReadyUp(now)
			} else if room.HasExpired(now, params.RoomLifespan) {
				k.DeleteRoom(ctx, roomID)
				k.RemoveRoomFromModePool(ctx, room.ModeId, roomID)
			}
		case *types.Room_Ready:
			if now.After(t.Ready.Add(params.PrestartWaitPeriod)) {
				k.CreateGame(ctx, room)
				k.DeleteRoom(ctx, roomID)
				k.RemoveRoomFromModePool(ctx, room.ModeId, roomID)
			}
		case *types.Room_Scheduled:
			if now.After(*t.Scheduled) {
				if room.HasQuorum() {
					k.CreateGame(ctx, room)
				}
				k.DeleteRoom(ctx, roomID)
				k.RemoveRoomFromModePool(ctx, room.ModeId, roomID)
			}
		}

	}
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

func (k Keeper) DeleteMode(ctx sdk.Context, modeID uint32) {
	store := ctx.KVStore(k.storeKey)
	store.Delete(types.ModeKey(modeID))
	store.Delete(types.RoomsByModeKey(modeID))
}

func (k Keeper) GetRoomsByMode(ctx sdk.Context, modeID uint32) (types.Rooms, bool) {
	store := ctx.KVStore(k.storeKey)
	var rooms types.Rooms
	bz := store.Get(types.RoomsByModeKey(modeID))
	if bz == nil {
		return types.Rooms{}, false
	}
	k.cdc.MustUnmarshal(bz, &rooms)
	return rooms, true
}

func (k Keeper) SetRooms(ctx sdk.Context, modeID uint32, rooms types.Rooms) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.RoomsByModeKey(modeID), k.cdc.MustMarshal(&rooms))
}

func (k Keeper) RemoveRoomFromModePool(ctx sdk.Context, modeID uint32, roomID uint64) {
	if modeID > 0 {
		rooms, exists := k.GetRoomsByMode(ctx, modeID)
		if !exists {
			panic("tried to remove a room from the mode pool that doesn't exist")
		}
		rooms.Remove(roomID)
		k.SetRooms(ctx, modeID, rooms)
	}
}

func (k Keeper) SetParams(ctx sdk.Context, params types.Params) {
	k.params.SetParamSet(ctx, &params)
}

func (k Keeper) GetParams(ctx sdk.Context) types.Params {
	var params types.Params
	k.params.GetParamSet(ctx, &params)
	return params
}

func (k Keeper) InitGenesis(ctx sdk.Context, genState types.GenesisState) {
	store := ctx.KVStore(k.storeKey)
	k.SetParams(ctx, genState.Params)
	store.Set(types.ModeIDKey, types.ModeIDBytes(genState.NextModeId))
	store.Set(types.RoomIDKey, types.RoomIDBytes(genState.NextRoomId))
}

func (k Keeper) ExportGenesis(ctx sdk.Context) types.GenesisState {
	return types.GenesisState{
		Params:     k.GetParams(ctx),
		NextRoomId: k.GetNextRoomID(ctx),
		NextModeId: k.GetNextModeID(ctx),
	}
}
