package claim_test

import (
	"testing"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	rook "github.com/arcane-systems/rook/app"
	"github.com/arcane-systems/rook/testutil/simapp"
	"github.com/arcane-systems/rook/x/claim"
	"github.com/arcane-systems/rook/x/claim/keeper"
	"github.com/arcane-systems/rook/x/claim/types"
)

var now = time.Now().UTC()
var acc1 = sdk.AccAddress([]byte("addr1---------------"))
var acc2 = sdk.AccAddress([]byte("addr2---------------"))
var testGenesis = types.GenesisState{
	Params: types.Params{
		AirdropStartTime:   now,
		DurationUntilDecay: types.DefaultDurationUntilDecay, // 2 month
		DurationOfDecay:    types.DefaultDurationOfDecay,    // 2 months
		ClaimDenom:         types.DefaultClaimDenom,         // urook
	},
	ClaimRecords: []types.ClaimRecord{
		{
			Address:                acc1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(types.DefaultClaimDenom, 1000000000),
			ActionCompleted:        []bool{true, false, true, true, false},
		},
		{
			Address:                acc2.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(types.DefaultClaimDenom, 500000000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	},
}

func TestClaimInitGenesis(t *testing.T) {
	app := simapp.New(t.TempDir())
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	ctx = ctx.WithBlockTime(now.Add(time.Second))
	genesis := testGenesis
	claim.InitGenesis(ctx, app.ClaimKeeper, genesis)

	coin := app.ClaimKeeper.GetModuleAccountBalance(ctx)
	require.Equal(t, coin.String(), genesis.TotalClaimable().String())

	params, err := app.ClaimKeeper.GetParams(ctx)
	require.NoError(t, err)
	require.Equal(t, params, genesis.Params)

	claimRecords := app.ClaimKeeper.GetClaimRecords(ctx)
	require.Equal(t, claimRecords, genesis.ClaimRecords)
}

func TestClaimExportGenesis(t *testing.T) {
	app := simapp.New(t.TempDir())
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	ctx = ctx.WithBlockTime(now.Add(time.Second))
	genesis := testGenesis
	claim.InitGenesis(ctx, app.ClaimKeeper, genesis)

	claimRecord, err := app.ClaimKeeper.GetClaimRecord(ctx, acc2)
	require.NoError(t, err)
	require.Equal(t, claimRecord, types.ClaimRecord{
		Address:                acc2.String(),
		InitialClaimableAmount: sdk.NewInt64Coin(types.DefaultClaimDenom, 500000000),
		ActionCompleted:        []bool{false, false, false, false, false},
	})

	claimableAmount, err := app.ClaimKeeper.GetClaimableAmountForAction(ctx, acc2, types.ActionPlay)
	require.NoError(t, err)
	require.Equal(t, claimableAmount, sdk.NewInt64Coin(types.DefaultClaimDenom, 100000000))

	msgServer := keeper.NewMsgServerImpl(app.ClaimKeeper)
	_, err = msgServer.Activate(sdk.WrapSDKContext(ctx), types.NewMsgActivate(acc2.String()))
	require.NoError(t, err)

	genesisExported := claim.ExportGenesis(ctx, app.ClaimKeeper)
	require.Equal(t, genesisExported.Params, genesis.Params)
	require.Equal(t, genesisExported.ClaimRecords, []types.ClaimRecord{
		{
			Address:                acc1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(types.DefaultClaimDenom, 1000000000),
			ActionCompleted:        []bool{true, false, true, true, false},
		},
		{
			Address:                acc2.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(types.DefaultClaimDenom, 500000000),
			ActionCompleted:        []bool{true, false, false, false, false},
		},
	})
}

func TestMarshalUnmarshalGenesis(t *testing.T) {
	app := simapp.New(t.TempDir())
	ctx := app.BaseApp.NewContext(false, tmproto.Header{})
	ctx = ctx.WithBlockTime(now.Add(time.Second))

	encodingConfig := rook.MakeEncodingConfig()
	appCodec := encodingConfig.Marshaler
	am := claim.NewAppModule(appCodec, app.ClaimKeeper)

	genesis := testGenesis
	claim.InitGenesis(ctx, app.ClaimKeeper, genesis)

	genesisExported := am.ExportGenesis(ctx, appCodec)
	assert.NotPanics(t, func() {
		app := simapp.New(t.TempDir())
		ctx := app.BaseApp.NewContext(false, tmproto.Header{})
		ctx = ctx.WithBlockTime(now.Add(time.Second))
		am := claim.NewAppModule(appCodec, app.ClaimKeeper)
		am.InitGenesis(ctx, appCodec, genesisExported)
	})
}
