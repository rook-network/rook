package keeper

import (
	"testing"

	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

    "github.com/cmwaters/rook/x/rook/types"
)

func TestPositionMsgServerCreate(t *testing.T) {
	srv, ctx := setupMsgServer(t)
	creator := "A"
	for i := 0; i < 5; i++ {
		resp, err := srv.CreatePosition(ctx, &types.MsgCreatePosition{Creator: creator})
		require.NoError(t, err)
		assert.Equal(t, i, int(resp.Id))
	}
}

func TestPositionMsgServerUpdate(t *testing.T) {
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgUpdatePosition
		err     error
	}{
		{
			desc:    "Completed",
			request: &types.MsgUpdatePosition{Creator: creator},
		},
		{
			desc:    "Unauthorized",
			request: &types.MsgUpdatePosition{Creator: "B"},
			err:     sdkerrors.ErrUnauthorized,
		},
		{
			desc:    "Unauthorized",
			request: &types.MsgUpdatePosition{Creator: creator, Id: 10},
			err:     sdkerrors.ErrKeyNotFound,
		},
	} {
		tc := tc
		t.Run(tc.desc, func(t *testing.T) {
			srv, ctx := setupMsgServer(t)
			_, err := srv.CreatePosition(ctx, &types.MsgCreatePosition{Creator: creator})
			require.NoError(t, err)

			_, err = srv.UpdatePosition(ctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}

func TestPositionMsgServerDelete(t *testing.T) {
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgDeletePosition
		err     error
	}{
		{
			desc:    "Completed",
			request: &types.MsgDeletePosition{Creator: creator},
		},
		{
			desc:    "Unauthorized",
			request: &types.MsgDeletePosition{Creator: "B"},
			err:     sdkerrors.ErrUnauthorized,
		},
		{
			desc:    "KeyNotFound",
			request: &types.MsgDeletePosition{Creator: creator, Id: 10},
			err:     sdkerrors.ErrKeyNotFound,
		},
	} {
		tc := tc
		t.Run(tc.desc, func(t *testing.T) {
			srv, ctx := setupMsgServer(t)

			_, err := srv.CreatePosition(ctx, &types.MsgCreatePosition{Creator: creator})
			require.NoError(t, err)
			_, err = srv.DeletePosition(ctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}
