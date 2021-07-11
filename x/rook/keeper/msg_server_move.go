package keeper

import (
	"context"

	"github.com/cmwaters/rook/x/rook/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) Move(goCtx context.Context, msg *types.MsgMove) (*types.MsgMoveResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgMoveResponse{}, nil
}
