package game

import (
	"github.com/arcane-systems/rook/x/game/keeper"
	"github.com/arcane-systems/rook/x/game/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// InitGenesis initializes the capability module's state from a provided genesis
// state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	k.SetParamsVersion(ctx, genState.ParamsVersion)

	k.SetGameID(ctx, genState.NextGameId)

	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the capability module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	// this line is used by starport scaffolding # ibc/genesis/export

	return genesis
}