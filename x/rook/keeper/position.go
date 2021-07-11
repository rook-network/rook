package keeper

import (
	"encoding/binary"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cmwaters/rook/x/rook/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	"strconv"
)

// GetPositionCount get the total number of position
func (k Keeper) GetPositionCount(ctx sdk.Context) uint64 {
	store :=  prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionCountKey))
	byteKey := types.KeyPrefix(types.PositionCountKey)
	bz := store.Get(byteKey)

	// Count doesn't exist: no element
	if bz == nil {
		return 0
	}

	// Parse bytes
	count, err := strconv.ParseUint(string(bz), 10, 64)
	if err != nil {
		// Panic because the count should be always formattable to iint64
		panic("cannot decode count")
	}

	return count
}

// SetPositionCount set the total number of position
func (k Keeper) SetPositionCount(ctx sdk.Context, count uint64)  {
	store :=  prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionCountKey))
	byteKey := types.KeyPrefix(types.PositionCountKey)
	bz := []byte(strconv.FormatUint(count, 10))
	store.Set(byteKey, bz)
}

// AppendPosition appends a position in the store with a new id and update the count
func (k Keeper) AppendPosition(
    ctx sdk.Context,
    position types.Position,
) uint64 {
	// Create the position
    count := k.GetPositionCount(ctx)

    // Set the ID of the appended value
    position.Id = count

    store :=  prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
    appendedValue := k.cdc.MustMarshalBinaryBare(&position)
    store.Set(GetPositionIDBytes(position.Id), appendedValue)

    // Update position count
    k.SetPositionCount(ctx, count+1)

    return count
}

// SetPosition set a specific position in the store
func (k Keeper) SetPosition(ctx sdk.Context, position types.Position) {
	store :=  prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	b := k.cdc.MustMarshalBinaryBare(&position)
	store.Set(GetPositionIDBytes(position.Id), b)
}

// GetPosition returns a position from its id
func (k Keeper) GetPosition(ctx sdk.Context, id uint64) types.Position {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	var position types.Position
	k.cdc.MustUnmarshalBinaryBare(store.Get(GetPositionIDBytes(id)), &position)
	return position
}

// HasPosition checks if the position exists in the store
func (k Keeper) HasPosition(ctx sdk.Context, id uint64) bool {
	store :=  prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	return store.Has(GetPositionIDBytes(id))
}

// GetPositionOwner returns the creator of the position
func (k Keeper) GetPositionOwner(ctx sdk.Context, id uint64) string {
    return k.GetPosition(ctx, id).Creator
}

// RemovePosition removes a position from the store
func (k Keeper) RemovePosition(ctx sdk.Context, id uint64) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	store.Delete(GetPositionIDBytes(id))
}

// GetAllPosition returns all position
func (k Keeper) GetAllPosition(ctx sdk.Context) (list []types.Position) {
    store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.Position
		k.cdc.MustUnmarshalBinaryBare(iterator.Value(), &val)
        list = append(list, val)
	}

    return
}

// GetPositionIDBytes returns the byte representation of the ID
func GetPositionIDBytes(id uint64) []byte {
	bz := make([]byte, 8)
	binary.BigEndian.PutUint64(bz, id)
	return bz
}

// GetPositionIDFromBytes returns ID in uint64 format from a byte array
func GetPositionIDFromBytes(bz []byte) uint64 {
	return binary.BigEndian.Uint64(bz)
}
