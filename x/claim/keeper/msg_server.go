package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/arcane-systems/rook/x/claim/types"
)

type msgServer struct {
	Keeper
}

// NewMsgServerImpl returns an implementation of the MsgServer interface
// for the provided Keeper.
func NewMsgServerImpl(keeper Keeper) types.MsgServer {
	return &msgServer{Keeper: keeper}
}

var _ types.MsgServer = msgServer{}

func (m msgServer) Activate(goCtx context.Context, msg *types.MsgActivate) (*types.MsgActivateResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	claimee, err := sdk.AccAddressFromBech32(msg.Claimee)
	if err != nil {
		return nil, err
	}

	_, err = m.Keeper.ClaimCoinsForAction(ctx, claimee, types.ActionActivate)

	return &types.MsgActivateResponse{}, err
}
