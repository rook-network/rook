package game

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rook-network/rook/x/game/keeper"
	"github.com/rook-network/rook/x/game/types"
)

// InitGenesis initializes the capability module's state from a provided genesis
// state.
func InitGenesis(ctx sdk.Context, k keeper.Keeper, genState types.GenesisState) {
	k.SetParamsVersion(ctx, genState.ParamsVersion)

	k.SetNextGameID(ctx, genState.NextGameId)

	k.SetParams(ctx, genState.Params)
}

// ExportGenesis returns the capability module's exported genesis.
func ExportGenesis(ctx sdk.Context, k keeper.Keeper) *types.GenesisState {
	genesis := types.DefaultGenesis()
	// this line is used by starport scaffolding # ibc/genesis/export

	return genesis
}
