package keeper

import (
	"fmt"

	"github.com/arcane-systems/rook/x/claim/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetParams get params
func (k Keeper) GetParams(ctx sdk.Context) (types.Params, error) {
	store := ctx.KVStore(k.storeKey)
	bz := store.Get([]byte(types.ParamsKey))
	params := types.Params{}
	err := k.cdc.Unmarshal(bz, &params)
	return params, err
}

// SetParams set params
func (k Keeper) SetParams(ctx sdk.Context, params types.Params) error {
	if err := params.ValidateBasic(); err != nil {
		return fmt.Errorf("failed to set params: %v", err)
	}
	store := ctx.KVStore(k.storeKey)
	bz, err := k.cdc.Marshal(&params)
	if err != nil {
		return err
	}
	store.Set([]byte(types.ParamsKey), bz)
	return nil
}
