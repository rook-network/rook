package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/rook/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) Build(goCtx context.Context, msg *types.MsgBuild) (*types.MsgBuildResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgBuildResponse{}, nil
}
