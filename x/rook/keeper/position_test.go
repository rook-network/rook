package keeper

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/assert"
    "github.com/cmwaters/rook/x/rook/types"
)

func createNPosition(keeper *Keeper, ctx sdk.Context, n int) []types.Position {
	items := make([]types.Position, n)
	for i := range items {
		items[i].Creator = "any"
		items[i].Id = keeper.AppendPosition(ctx, items[i])
	}
	return items
}

func TestPositionGet(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	items := createNPosition(keeper, ctx, 10)
	for _, item := range items {
		assert.Equal(t, item, keeper.GetPosition(ctx, item.Id))
	}
}

func TestPositionExist(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	items := createNPosition(keeper, ctx, 10)
	for _, item := range items {
		assert.True(t, keeper.HasPosition(ctx, item.Id))
	}
}

func TestPositionRemove(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	items := createNPosition(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemovePosition(ctx, item.Id)
		assert.False(t, keeper.HasPosition(ctx, item.Id))
	}
}

func TestPositionGetAll(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	items := createNPosition(keeper, ctx, 10)
	assert.Equal(t, items, keeper.GetAllPosition(ctx))
}

func TestPositionCount(t *testing.T) {
	keeper, ctx := setupKeeper(t)
	items := createNPosition(keeper, ctx, 10)
	count := uint64(len(items))
	assert.Equal(t, count, keeper.GetPositionCount(ctx))
}
