package claim

import (
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/rook-network/rook/x/claim/keeper"
)

// EndBlocker called every block, process inflation, update validator set.
func EndBlocker(ctx sdk.Context, k keeper.Keeper) {

	params, err := k.GetParams(ctx)
	if err != nil {
		panic(fmt.Sprintf("unable to get params in end blocker: %v", err))
	}

	if err := params.ValidateBasic(); err != nil {
		panic(fmt.Sprintf("invalid params from end blocker: %v", err))
	}

	// End Airdrop
	goneTime := ctx.BlockTime().Sub(params.AirdropStartTime)
	if goneTime > params.DurationUntilDecay+params.DurationOfDecay {
		// airdrop time passed
		err := k.EndAirdrop(ctx)
		if err != nil {
			panic(err)
		}
	}
}
