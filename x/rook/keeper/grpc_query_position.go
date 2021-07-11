package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/cmwaters/rook/x/rook/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) PositionAll(c context.Context, req *types.QueryAllPositionRequest) (*types.QueryAllPositionResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var positions []*types.Position
	ctx := sdk.UnwrapSDKContext(c)

	store := ctx.KVStore(k.storeKey)
	positionStore := prefix.NewStore(store, types.KeyPrefix(types.PositionKey))

	pageRes, err := query.Paginate(positionStore, req.Pagination, func(key []byte, value []byte) error {
		var position types.Position
		if err := k.cdc.UnmarshalBinaryBare(value, &position); err != nil {
			return err
		}

		positions = append(positions, &position)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllPositionResponse{Position: positions, Pagination: pageRes}, nil
}

func (k Keeper) Position(c context.Context, req *types.QueryGetPositionRequest) (*types.QueryGetPositionResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var position types.Position
	ctx := sdk.UnwrapSDKContext(c)

    if !k.HasPosition(ctx, req.Id) {
        return nil, sdkerrors.ErrKeyNotFound
    }

	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.PositionKey))
	k.cdc.MustUnmarshalBinaryBare(store.Get(GetPositionIDBytes(req.Id)), &position)

	return &types.QueryGetPositionResponse{Position: &position}, nil
}
