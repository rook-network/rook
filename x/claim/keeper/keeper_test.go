package keeper_test

import (
	"os"
	"testing"
	"time"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/suite"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"

	"github.com/arcane-systems/rook/app"
	"github.com/arcane-systems/rook/testutil/simapp"
	"github.com/arcane-systems/rook/x/claim/keeper"
	"github.com/arcane-systems/rook/x/claim/types"
)

type KeeperTestSuite struct {
	suite.Suite

	ctx       sdk.Context
	app       *app.App
	msgServer types.MsgServer
}

func (suite *KeeperTestSuite) SetupTest() {
	dir := os.TempDir()
	suite.app = simapp.New(dir)
	suite.ctx = suite.app.BaseApp.NewContext(false, tmproto.Header{Height: 1, ChainID: "osmosis-1", Time: time.Now().UTC()})

	airdropStartTime := time.Now()
	suite.app.ClaimKeeper.CreateModuleAccount(suite.ctx, sdk.NewCoin(sdk.DefaultBondDenom, sdk.NewInt(10000000)))

	suite.app.ClaimKeeper.SetParams(suite.ctx, types.Params{
		AirdropStartTime:   airdropStartTime,
		DurationUntilDecay: types.DefaultDurationUntilDecay,
		DurationOfDecay:    types.DefaultDurationOfDecay,
		ClaimDenom:         sdk.DefaultBondDenom,
	})

	suite.ctx = suite.ctx.WithBlockTime(airdropStartTime)
	suite.msgServer = keeper.NewMsgServerImpl(suite.app.ClaimKeeper)

	
}

func TestKeeperTestSuite(t *testing.T) {
	suite.Run(t, new(KeeperTestSuite))
}
