package keeper

import (
	"fmt"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	"github.com/tendermint/tendermint/crypto/tmhash"
	"github.com/tendermint/tendermint/libs/log"

	game "github.com/arcane-systems/rook/x/game/types"
	"github.com/arcane-systems/rook/x/matchmaker/types"
)

type Keeper struct {
	cdc        codec.Codec
	params     paramtypes.Subspace
	storeKey   sdk.StoreKey
	gameServer game.MsgServer
}

func NewKeeper(
	cdc codec.Codec,
	storeKey sdk.StoreKey,
	paramSpace paramtypes.Subspace,
	gameServer game.MsgServer,
) Keeper {
	if !paramSpace.HasKeyTable() {
		paramSpace = paramSpace.WithKeyTable(types.ParamKeyTable())
	}

	return Keeper{
		cdc:        cdc,
		storeKey:   storeKey,
		params:     paramSpace,
		gameServer: gameServer,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

func (k Keeper) CreateGameWithEvents(ctx sdk.Context, roomID uint64, room types.Room) {
	gameID, err := k.CreateGame(ctx, roomID, room)
	if err != nil {
		ctx.Logger().Error("failed to create game", "err", err)
	}

	ctx.EventManager().EmitEvent(types.NewGameStartedEvent(roomID, gameID))
}

func (k Keeper) CreateGame(ctx sdk.Context, roomID uint64, room types.Room) (uint64, error) {
	var config game.Config
	switch g := room.Game.(type) {
	case *types.Room_Config:
		config = *g.Config
	case *types.Room_ModeId:
		mode, ok := k.GetMode(ctx, g.ModeId)
		if !ok {
			return 0, fmt.Errorf("game mode %d does not exist", g.ModeId)
		}
		config = mode.Config
	default:
		return 0, fmt.Errorf("unknown room game type %T", g)
	}

	if !config.HasSeed() {
		// TODO: for common games we need to set a seed. For now, we use the unix block time as the
		// seed although this is a poor random generator and will mean that all games started in a
		// height will have the same map
		config.Map.Seed = ctx.BlockTime().Unix()
	}

	msg := game.NewMsgCreate(room.Players, config)

	resp, err := k.gameServer.Create(sdk.WrapSDKContext(ctx), msg)
	if err != nil {
		return 0, fmt.Errorf("failed to start game: %w", err)
	}

	return resp.GameId, nil
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
			switch {
			case room.IsFull():
				k.CreateGameWithEvents(ctx, roomID, room)
				k.DeleteRoomWithEvents(ctx, roomID, room)
				if room.IsCommon() {
					k.DetachCommonRoom(ctx, room.ModeID())
				}

			case room.HasQuorum():
				room.ReadyUp(now)
				k.SetRoom(ctx, roomID, room)

			case room.HasExpired(now, params.RoomLifespan):
				k.DeleteRoomWithEvents(ctx, roomID, room)
				if room.IsCommon() {
					k.DetachCommonRoom(ctx, room.ModeID())
				}
			}
		case *types.Room_Ready:
			if now.After(t.Ready.Add(params.PrestartWaitPeriod)) {
				k.CreateGameWithEvents(ctx, roomID, room)
				k.DeleteRoomWithEvents(ctx, roomID, room)
				if room.IsCommon() {
					k.DetachCommonRoom(ctx, room.ModeID())
				}
			}
		case *types.Room_Scheduled:
			if now.After(*t.Scheduled) {
				if room.HasQuorum() {
					k.CreateGameWithEvents(ctx, roomID, room)
				}
				k.DeleteRoomWithEvents(ctx, roomID, room)
				if room.IsCommon() {
					k.DetachCommonRoom(ctx, room.ModeID())
				}
			}
		}

	}
}

// FindPlayer performs a range scan returning the room that the player is currently in,
// if any. CONTRACT: a player can never be in more than one room.
// TODO: This process is performed often and could be made a lot more efficient if we used
// a secondary key.
func (k Keeper) FindPlayer(ctx sdk.Context, player string) (bool, types.IndexedRoom) {
	store := ctx.KVStore(k.storeKey)

	roomIter := store.Iterator(
		types.RoomKey(0),
		types.RoomKey(1<<63-1),
	)
	for ; roomIter.Valid(); roomIter.Next() {
		var room types.Room
		k.cdc.MustUnmarshal(roomIter.Value(), &room)

		for _, roomPlayer := range room.Players {
			if roomPlayer == player {
				return true, types.IndexedRoom{
					RoomId: types.ParseRoomKey(roomIter.Key()),
					Room:   room,
				}
			}
		}
	}

	return false, types.IndexedRoom{}
}

// RemovePlayerFromRoom checks if a player is in any room and removes that player from the room
func (k Keeper) RemovePlayerFromCurrentRoom(ctx sdk.Context, player string) {
	if ok, ir := k.FindPlayer(ctx, player); ok {
		ir.Room.RemovePlayer(player)

		if ir.Room.IsEmpty() {
			k.DeleteRoom(ctx, ir.RoomId)
			if ir.Room.IsCommon() {
				k.DetachCommonRoom(ctx, ir.Room.ModeID())
			}
		} else {
			k.SetRoom(ctx, ir.RoomId, ir.Room)
		}

		ctx.EventManager().EmitEvent(types.NewPlayerLeftEvent(ir.RoomId, player))
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

func (k Keeper) DeleteRoomWithEvents(ctx sdk.Context, roomID uint64, room types.Room) {
	k.DeleteRoom(ctx, roomID)
	for _, player := range room.Players {
		ctx.EventManager().EmitEvent(types.NewPlayerLeftEvent(roomID, player))
	}
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

func (k Keeper) GetAvailableGames(ctx sdk.Context) []types.IndexedRoom {
	store := ctx.KVStore(k.storeKey)
	rooms := make([]types.IndexedRoom, 0)
	roomIter := store.Iterator(
		types.RoomKey(0),
		types.RoomKey(1<<63-1),
	)

	for ; roomIter.Valid(); roomIter.Next() {
		var room types.Room
		k.cdc.MustUnmarshal(roomIter.Value(), &room)

		if room.Public && !room.IsFull() {
			rooms = append(rooms, types.IndexedRoom{
				RoomId: types.ParseRoomID(roomIter.Key()),
				Room:   room,
			})
		}
	}

	return rooms
}

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

func (k Keeper) GetCommonRoom(ctx sdk.Context, modeID uint32) (uint64, types.Room, bool) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get(types.CommonRoomKey(modeID))
	if len(bz) == 0 {
		return 0, types.Room{}, false
	}
	roomID := types.ParseRoomID(bz)
	room, exists := k.GetRoom(ctx, roomID)
	return roomID, room, exists
}

func (k Keeper) HasCommonRoom(ctx sdk.Context, modeID uint32) bool {
	store := ctx.KVStore(k.storeKey)
	return store.Has(types.CommonRoomKey(modeID))
}

func (k Keeper) SetCommonRoom(ctx sdk.Context, modeID uint32, roomID uint64) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.CommonRoomKey(modeID), types.RoomIDBytes(roomID))
}

func (k Keeper) DetachCommonRoom(ctx sdk.Context, modeID uint32) {
	if modeID > 0 {
		store := ctx.KVStore(k.storeKey)
		store.Delete(types.CommonRoomKey(modeID))
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
	for _, mode := range genState.InitialModes {
		k.SetMode(ctx, genState.NextModeId, mode)
		genState.NextModeId++
	}
	store.Set(types.ModeIDKey, types.ModeIDBytes(genState.NextModeId))
	store.Set(types.RoomIDKey, types.RoomIDBytes(genState.NextRoomId))
}

func (k Keeper) ExportGenesis(ctx sdk.Context) types.GenesisState {
	return types.GenesisState{
		Params:       k.GetParams(ctx),
		InitialModes: k.GetAllModes(ctx),
		NextRoomId:   k.GetNextRoomID(ctx),
		NextModeId:   k.GetNextModeID(ctx),
	}
}
