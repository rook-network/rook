package keeper

import (
    "fmt"
	"context"

    "github.com/cmwaters/rook/x/rook/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)


func (k msgServer) CreatePosition(goCtx context.Context,  msg *types.MsgCreatePosition) (*types.MsgCreatePositionResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

    var position = types.Position{
        Creator: msg.Creator,
        X: msg.X,
        Y: msg.Y,
    }

    id := k.AppendPosition(
        ctx,
        position,
    )

	return &types.MsgCreatePositionResponse{
	    Id: id,
	}, nil
}

func (k msgServer) UpdatePosition(goCtx context.Context,  msg *types.MsgUpdatePosition) (*types.MsgUpdatePositionResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

    var position = types.Position{
		Creator: msg.Creator,
		Id:      msg.Id,
    	X: msg.X,
    	Y: msg.Y,
	}

    // Checks that the element exists
    if !k.HasPosition(ctx, msg.Id) {
        return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, fmt.Sprintf("key %d doesn't exist", msg.Id))
    }

    // Checks if the the msg sender is the same as the current owner
    if msg.Creator != k.GetPositionOwner(ctx, msg.Id) {
        return nil, sdkerrors.Wrap(sdkerrors.ErrUnauthorized, "incorrect owner")
    }

	k.SetPosition(ctx, position)

	return &types.MsgUpdatePositionResponse{}, nil
}

func (k msgServer) DeletePosition(goCtx context.Context,  msg *types.MsgDeletePosition) (*types.MsgDeletePositionResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

    if !k.HasPosition(ctx, msg.Id) {
        return nil, sdkerrors.Wrap(sdkerrors.ErrKeyNotFound, fmt.Sprintf("key %d doesn't exist", msg.Id))
    }
    if msg.Creator != k.GetPositionOwner(ctx, msg.Id) {
        return nil, sdkerrors.Wrap(sdkerrors.ErrUnauthorized, "incorrect owner")
    }

	k.RemovePosition(ctx, msg.Id)

	return &types.MsgDeletePositionResponse{}, nil
}
