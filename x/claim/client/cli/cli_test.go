package cli_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/cosmos/cosmos-sdk/crypto/keys/ed25519"

	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/crypto/hd"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	servertypes "github.com/cosmos/cosmos-sdk/server/types"
	"github.com/cosmos/cosmos-sdk/simapp"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	clitestutil "github.com/cosmos/cosmos-sdk/testutil/cli"
	"github.com/cosmos/cosmos-sdk/testutil/network"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/rook-network/rook/app"
	"github.com/rook-network/rook/x/claim/client/cli"
	"github.com/rook-network/rook/x/claim/types"
	claimtypes "github.com/rook-network/rook/x/claim/types"
	"github.com/stretchr/testify/suite"
	tmcli "github.com/tendermint/tendermint/libs/cli"
	dbm "github.com/tendermint/tm-db"
)

var addr1 sdk.AccAddress
var addr2 sdk.AccAddress

func init() {
	app.SetConfig()
	addr1 = ed25519.GenPrivKey().PubKey().Address().Bytes()
	addr2 = ed25519.GenPrivKey().PubKey().Address().Bytes()
}

type IntegrationTestSuite struct {
	suite.Suite

	cfg     network.Config
	network *network.Network
}

func (s *IntegrationTestSuite) SetupSuite() {

	s.T().Log("setting up integration test suite")
	encCfg := app.MakeEncodingConfig()

	genState := app.ModuleBasics.DefaultGenesis(encCfg.Marshaler)
	claimGenState := claimtypes.DefaultGenesis()
	s.T().Log(addr1.String())
	claimGenState.ClaimRecords = []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: 100,
			ActionCompleted:        []bool{true, false, false, false, false},
		},
		{
			Address:                addr2.String(),
			InitialClaimableAmount: 20,
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}
	claimGenState.Params.ClaimDenom = sdk.DefaultBondDenom
	claimGenStateBz := encCfg.Marshaler.MustMarshalJSON(claimGenState)
	genState[claimtypes.ModuleName] = claimGenStateBz

	s.cfg = network.Config{
		Codec:             encCfg.Marshaler,
		TxConfig:          encCfg.TxConfig,
		LegacyAmino:       encCfg.Amino,
		InterfaceRegistry: encCfg.InterfaceRegistry,
		AccountRetriever:  authtypes.AccountRetriever{},
		AppConstructor: func(val network.Validator) servertypes.Application {
			return app.New(
				val.Ctx.Logger, dbm.NewMemDB(), nil, true, make(map[int64]bool), val.Ctx.Config.RootDir, 0,
				encCfg,
				simapp.EmptyAppOptions{},
				baseapp.SetMinGasPrices(val.AppConfig.MinGasPrices),
			)
		},
		GenesisState:    genState,
		TimeoutCommit:   2 * time.Second,
		ChainID:         "rook-1",
		NumValidators:   1,
		BondDenom:       sdk.DefaultBondDenom,
		MinGasPrices:    fmt.Sprintf("0.000006%s", sdk.DefaultBondDenom),
		AccountTokens:   sdk.TokensFromConsensusPower(1000, sdk.DefaultPowerReduction),
		StakingTokens:   sdk.TokensFromConsensusPower(500, sdk.DefaultPowerReduction),
		BondedTokens:    sdk.TokensFromConsensusPower(100, sdk.DefaultPowerReduction),
		PruningStrategy: storetypes.PruningOptionNothing,
		CleanupDir:      true,
		SigningAlgo:     string(hd.Secp256k1Type),
		KeyringOptions:  []keyring.Option{},
	}

	s.network = network.New(s.T(), s.cfg)

	_, err := s.network.WaitForHeight(1)
	s.Require().NoError(err)
}

func (s *IntegrationTestSuite) TearDownSuite() {
	s.T().Log("tearing down integration test suite")
	s.network.Cleanup()
}

// TODO: Figure out how to get genesis time from IntegrationTestSuite
// Because right now, verifying the correctness of the airdrop_start_time
// isn't possible.
// Other than that, this works

// func (s *IntegrationTestSuite) TestGetCmdQueryParams() {
// 	val := s.network.Validators[0]

// 	testCases := []struct {
// 		name           string
// 		args           []string
// 		expectedOutput string
// 	}{
// 		{
// 			"json output",
// 			[]string{fmt.Sprintf("--%s=1", flags.FlagHeight), fmt.Sprintf("--%s=json", tmcli.OutputFlag)},
// 			`{"airdrop_start_time":"1970-01-01T00:00:00Z","duration_until_decay":"3600s","duration_of_decay":"18000s"}`,
// 		},
// 		{
// 			"text output",
// 			[]string{fmt.Sprintf("--%s=1", flags.FlagHeight), fmt.Sprintf("--%s=text", tmcli.OutputFlag)},
// 			`airdrop_start_time: "1970-01-01T00:00:00Z"
// duration_of_decay: 18000s
// duration_until_decay: 3600s`,
// 		},
// 	}

// 	for _, tc := range testCases {
// 		tc := tc

// 		s.Run(tc.name, func() {
// 			cmd := cli.GetCmdQueryParams()
// 			clientCtx := val.ClientCtx

// 			out, err := clitestutil.ExecTestCLICmd(clientCtx, cmd, tc.args)
// 			s.Require().NoError(err)
// 			s.Require().Equal(tc.expectedOutput, strings.TrimSpace(out.String()))
// 		})
// 	}
// }

func (s *IntegrationTestSuite) TestCmdQueryClaimRecord() {
	val := s.network.Validators[0]

	testCases := []struct {
		name string
		args []string
	}{
		{
			"query claim record",
			[]string{
				addr1.String(),
				fmt.Sprintf("--%s=json", tmcli.OutputFlag),
			},
		},
	}

	for _, tc := range testCases {
		tc := tc

		s.Run(tc.name, func() {
			cmd := cli.GetCmdQueryClaimRecord()
			clientCtx := val.ClientCtx

			out, err := clitestutil.ExecTestCLICmd(clientCtx, cmd, tc.args)
			s.Require().NoError(err)

			var result types.QueryClaimRecordResponse
			s.Require().NoError(clientCtx.JSONCodec.UnmarshalJSON(out.Bytes(), &result))
			s.Require().Equal(int64(100), result.ClaimRecord.InitialClaimableAmount)
		})
	}
}

func (s *IntegrationTestSuite) TestCmdQueryClaimableForAction() {
	val := s.network.Validators[0]

	testCases := []struct {
		name  string
		args  []string
		coins sdk.Coin
	}{
		{
			"query claimable-for-action",
			[]string{
				addr1.String(),
				types.ActionPlay.String(),
				fmt.Sprintf("--%s=json", tmcli.OutputFlag),
			},
			sdk.NewInt64Coin(s.cfg.BondDenom, 20),
		},
	}

	for _, tc := range testCases {
		tc := tc

		s.Run(tc.name, func() {
			cmd := cli.GetCmdQueryClaimableForAction()
			clientCtx := val.ClientCtx

			out, err := clitestutil.ExecTestCLICmd(clientCtx, cmd, tc.args)
			s.Require().NoError(err)

			var result types.QueryClaimableForActionResponse
			s.Require().NoError(clientCtx.JSONCodec.UnmarshalJSON(out.Bytes(), &result))
			s.Require().Equal(result.Coins.String(), tc.coins.String())
		})
	}
}

func (s *IntegrationTestSuite) TestCmdTxActivate() {
	val := s.network.Validators[0]

	testCases := []struct {
		name  string
		args  []string
		coins sdk.Coin
	}{
		{
			"submit activate claim tx",
			[]string{
				addr1.String(),
				fmt.Sprintf("--%s=%s", flags.FlagFrom, val.Address.String()),
				fmt.Sprintf("--%s=json", tmcli.OutputFlag),
			},
			sdk.NewInt64Coin(s.cfg.BondDenom, 20),
		},
	}

	for _, tc := range testCases {
		tc := tc

		s.Run(tc.name, func() {
			cmd := cli.GetCmdTxActivate()
			clientCtx := val.ClientCtx

			out, err := clitestutil.ExecTestCLICmd(clientCtx, cmd, tc.args)
			s.Require().NoError(err)

			var result types.MsgActivateResponse
			s.Require().NoError(clientCtx.JSONCodec.UnmarshalJSON(out.Bytes(), &result))
			s.Require().Equal(result.Claimed.String(), tc.coins.String())
		})
	}
}

func TestIntegrationTestSuite(t *testing.T) {
	suite.Run(t, new(IntegrationTestSuite))
}
