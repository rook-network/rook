package claim

import (
	"fmt"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/arcane-systems/rook/x/claim/keeper"
	"github.com/arcane-systems/rook/x/claim/types"
)

// InitGenesis initializes the capability module's state from a provided genesis
// state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	if err := genState.ValidateBasic(); err != nil {
		panic("invalid genesis state: " + err.Error())
	}

	// TODO: Can we ensure that the module account created is equal everytime?
	k.CreateModuleAccount(ctx, genState.TotalClaimable())

	if genState.Params.AirdropStartTime.Equal(time.Time{}) {
		genState.Params.AirdropStartTime = ctx.BlockTime()
	}

	if err := k.SetParams(ctx, genState.Params); err != nil {
		panic(fmt.Sprintf("unable to set params in genesis: %v", err))
	}
	if err := k.SetClaimRecords(ctx, genState.ClaimRecords); err != nil {
		panic(fmt.Sprintf("failed to set claim records in init genesis: %v", err))
	}
}

// ExportGenesis returns the capability module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	params, err := k.GetParams(ctx)
	if err != nil {
		panic(fmt.Sprintf("unable to export geneseis: %v", err))
	}
	genesis := types.DefaultGenesis()
	genesis.Params = params
	genesis.ClaimRecords = k.GetClaimRecords(ctx)
	return genesis
}
