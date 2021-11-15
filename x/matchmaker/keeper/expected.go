package keeper

import (
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/rook-network/rook/x/game/types"
)

type GameKeeper interface {
	CreateGame(sdk.Context, []string, types.Config) (uint64, error)
	IsPlaying(sdk.Context, string) bool
	LeaveGame(sdk.Context, string)
}
