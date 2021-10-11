package keeper_test

import (
	"time"

	"github.com/arcane-systems/rook/x/claim/types"
	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	stakingkeeper "github.com/cosmos/cosmos-sdk/x/staking/keeper"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

func (suite *KeeperTestSuite) TestHookOfUnclaimableAccount() {
	suite.SetupTest()

	pub1 := secp256k1.GenPrivKey().PubKey()
	addr1 := sdk.AccAddress(pub1.Address())
	suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr1, nil, 0, 0))

	claim, err := suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.NoError(err)
	suite.Equal(types.ClaimRecord{}, claim)

	suite.app.ClaimKeeper.AfterPlayedGame(suite.ctx, 1, addr1)

	balances := suite.app.BankKeeper.GetAllBalances(suite.ctx, addr1)
	suite.Equal(sdk.Coins{}, balances)
}

func (suite *KeeperTestSuite) TestHookBeforeAirdropStart() {
	suite.SetupTest()

	airdropStartTime := time.Now().Add(time.Hour)

	err := suite.app.ClaimKeeper.SetParams(suite.ctx, types.Params{
		AirdropStartTime:   airdropStartTime,
		DurationUntilDecay: time.Hour,
		DurationOfDecay:    time.Hour * 4,
		ClaimDenom: sdk.DefaultBondDenom,
	})
	suite.Require().NoError(err)

	pub1 := secp256k1.GenPrivKey().PubKey()
	addr1 := sdk.AccAddress(pub1.Address())

	claimRecords := []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 1000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}
	suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr1, nil, 0, 0))
	goCtx := sdk.WrapSDKContext(suite.ctx)

	err = suite.app.ClaimKeeper.SetClaimRecords(suite.ctx, claimRecords)
	suite.Require().NoError(err)

	coins, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr1)
	suite.NoError(err)
	// Now, it is before starting air drop, so this value should return the empty coins
	suite.True(coins.IsZero())

	coins, err = suite.app.ClaimKeeper.GetClaimableAmountForAction(suite.ctx, addr1, types.ActionPlay)
	suite.NoError(err)
	// Now, it is before starting air drop, so this value should return the empty coins
	suite.True(coins.IsZero())

	resp, err := suite.msgServer.Activate(goCtx, types.NewMsgActivate(addr1.String()))
	suite.NoError(err)
	suite.Require().True(resp.Claimed.IsZero())
	balances := suite.app.BankKeeper.GetAllBalances(suite.ctx, addr1)
	// Now, it is before starting air drop, so claim module should not send the balances to the user after swap.
	suite.True(balances.Empty())

	goCtx = sdk.WrapSDKContext(suite.ctx.WithBlockTime(airdropStartTime))
	resp, err = suite.msgServer.Activate(goCtx, types.NewMsgActivate(addr1.String()))
	suite.NoError(err)
	suite.Require().Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)), resp.Claimed.Amount)
	balances = suite.app.BankKeeper.GetAllBalances(suite.ctx, addr1)
	// Now, it is the time for air drop, so claim module should send the balances to the user after swap.
	suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), balances.AmountOf(sdk.DefaultBondDenom).String())
}

func (suite *KeeperTestSuite) TestDuplicatedActionNotWithdrawRepeatedly() {
	suite.SetupTest()

	pub1 := secp256k1.GenPrivKey().PubKey()
	addr1 := sdk.AccAddress(pub1.Address())

	claimRecords := []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 1000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}
	suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr1, nil, 0, 0))

	err := suite.app.ClaimKeeper.SetClaimRecords(suite.ctx, claimRecords)
	suite.Require().NoError(err)

	coins1, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr1)
	suite.Require().NoError(err)
	suite.Require().Equal(coins1, claimRecords[0].InitialClaimableAmount)

	activateMsg := types.NewMsgActivate(addr1.String())
	suite.msgServer.Activate(sdk.WrapSDKContext(suite.ctx), activateMsg)

	claim, err := suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.NoError(err)
	suite.True(claim.ActionCompleted[types.ActionActivate])
	claimedCoins := suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(claimedCoins.Amount, claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)))

	// send the same msg again
	suite.msgServer.Activate(sdk.WrapSDKContext(suite.ctx), activateMsg)

	claim, err = suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.NoError(err)
	suite.True(claim.ActionCompleted[types.ActionActivate])
	claimedCoins = suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(claimedCoins.Amount, claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)))

	// check that the hooks also work
	suite.app.ClaimKeeper.AfterPlayedGame(suite.ctx, 1, addr1)

	claim, err = suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.NoError(err)
	suite.True(claim.ActionCompleted[types.ActionActivate])
	claimedCoins = suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(claimedCoins.Amount, claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).Mul(sdk.NewInt(2)))

	// after the second game
	suite.app.ClaimKeeper.AfterPlayedGame(suite.ctx, 1, addr1)

	claim, err = suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.NoError(err)
	suite.True(claim.ActionCompleted[types.ActionActivate])
	claimedCoins = suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(claimedCoins.Amount, claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).Mul(sdk.NewInt(2)))
}

func (suite *KeeperTestSuite) TestDelegationAutoWithdrawAndDelegateMore() {
	suite.SetupTest()

	pub1 := secp256k1.GenPrivKey().PubKey()
	pub2 := secp256k1.GenPrivKey().PubKey()
	addr1 := sdk.AccAddress(pub1.Address())
	addr2 := sdk.AccAddress(pub2.Address())

	claimRecords := []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 1000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
		{
			Address:                addr2.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 1000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}

	suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr1, nil, 0, 0))
	suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr2, nil, 0, 0))

	err := suite.app.ClaimKeeper.SetClaimRecords(suite.ctx, claimRecords)
	suite.Require().NoError(err)

	coins1, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr1)
	suite.Require().NoError(err)
	suite.Require().Equal(coins1, claimRecords[0].InitialClaimableAmount)
	coins2, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr2)
	suite.Require().NoError(err)
	suite.Require().Equal(coins2, claimRecords[1].InitialClaimableAmount)

	validator, err := stakingtypes.NewValidator(sdk.ValAddress(addr1), pub1, stakingtypes.Description{})
	suite.Require().NoError(err)
	validator = stakingkeeper.TestingUpdateValidator(suite.app.StakingKeeper, suite.ctx, validator, true)
	suite.app.StakingKeeper.AfterValidatorCreated(suite.ctx, validator.GetOperator())

	delAmount := sdk.TokensFromConsensusPower(1, sdk.DefaultPowerReduction)
	validator, _ = validator.AddTokensFromDel(delAmount)

	_, err = suite.msgServer.Activate(sdk.WrapSDKContext(suite.ctx), types.NewMsgActivate(addr2.String()))
	suite.NoError(err)
	coins3 := suite.app.BankKeeper.GetBalance(suite.ctx, addr2, sdk.DefaultBondDenom)
	suite.Require().Equal(claimRecords[1].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)), coins3.Amount)
	_, err = suite.app.StakingKeeper.Delegate(suite.ctx, addr2, coins3.Amount, stakingtypes.Unbonded, validator, true)
	suite.NoError(err)

	// delegation should automatically call claim and withdraw balance
	claimedCoins := suite.app.BankKeeper.GetBalance(suite.ctx, addr2, sdk.DefaultBondDenom)
	suite.Require().Equal(claimRecords[1].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), claimedCoins.Amount.String())

	// should be able to delegate the claimed coins
	_, err = suite.app.StakingKeeper.Delegate(suite.ctx, addr2, claimedCoins.Amount, stakingtypes.Unbonded, validator, true)
	suite.NoError(err)
}

func (suite *KeeperTestSuite) TestAirdropFlow() {
	suite.SetupTest()

	addr1 := sdk.AccAddress(secp256k1.GenPrivKey().PubKey().Address())
	addr2 := sdk.AccAddress(secp256k1.GenPrivKey().PubKey().Address())
	addr3 := sdk.AccAddress(secp256k1.GenPrivKey().PubKey().Address())

	claimRecords := []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 100),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
		{
			Address:                addr2.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 200),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}

	goCtx := sdk.WrapSDKContext(suite.ctx)

	err := suite.app.ClaimKeeper.SetClaimRecords(suite.ctx, claimRecords)
	suite.Require().NoError(err)

	coins1, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr1)
	suite.Require().NoError(err)
	suite.Require().Equal(coins1, claimRecords[0].InitialClaimableAmount, coins1.String())

	coins2, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr2)
	suite.Require().NoError(err)
	suite.Require().Equal(coins2, claimRecords[1].InitialClaimableAmount, coins2.String())

	coins3, err := suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr3)
	suite.Require().NoError(err)
	suite.Require().Equal(coins3, sdk.Coin{})

	// get rewards amount per action
	coins4, err := suite.app.ClaimKeeper.GetClaimableAmountForAction(suite.ctx, addr1, types.ActionWin)
	suite.Require().NoError(err)
	suite.Require().Equal(coins4.String(), sdk.NewCoins(sdk.NewInt64Coin(sdk.DefaultBondDenom, 20)).String()) // 2 = 10.Quo(5)

	// get completed activities
	claimRecord, err := suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.Require().NoError(err)
	for i := range types.Action_name {
		suite.Require().False(claimRecord.ActionCompleted[i])
	}

	// user should not be able to claim an action before activating the claim
	_, err = suite.app.ClaimKeeper.ClaimCoinsForAction(suite.ctx, addr1, types.ActionWin)
	suite.Require().Error(err)

	// do 3/5 of actions
	_, err = suite.msgServer.Activate(goCtx, types.NewMsgActivate(addr1.String()))
	suite.Require().NoError(err)
	suite.app.ClaimKeeper.AfterWonGame(suite.ctx, addr1)
	suite.app.ClaimKeeper.AfterPlayedGame(suite.ctx, 1, addr1)

	// check that 3/5 are completed
	claimRecord, err = suite.app.ClaimKeeper.GetClaimRecord(suite.ctx, addr1)
	suite.Require().NoError(err)
	suite.Require().True(claimRecord.ActionCompleted[types.ActionActivate])
	suite.Require().True(claimRecord.ActionCompleted[types.ActionWin])
	suite.Require().True(claimRecord.ActionCompleted[types.ActionPlay])

	// get balance after 3 actions done
	coins1 = suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(coins1.String(), sdk.NewCoins(sdk.NewInt64Coin(sdk.DefaultBondDenom, 60)).String())

	// check that claimable for completed activity is 0
	coins4, err = suite.app.ClaimKeeper.GetClaimableAmountForAction(suite.ctx, addr1, types.ActionWin)
	suite.Require().NoError(err)
	suite.Require().Equal(sdk.NewInt64Coin(sdk.DefaultBondDenom, 0).String(), coins4.String()) // 2 = 10.Quo(4)

	// do rest of actions
	suite.app.ClaimKeeper.AfterTrade(suite.ctx, addr1)
	suite.app.ClaimKeeper.AfterDelegationModified(suite.ctx, addr1, sdk.ValAddress(addr1))

	// get balance after rest actions done
	coins1 = suite.app.BankKeeper.GetBalance(suite.ctx, addr1, sdk.DefaultBondDenom)
	suite.Require().Equal(coins1.String(), sdk.NewInt64Coin(sdk.DefaultBondDenom, 100).String())

	// get claimable after withdrawing all
	coins1, err = suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr1)
	suite.Require().NoError(err)
	suite.Require().True(coins1.IsZero())

	err = suite.app.ClaimKeeper.EndAirdrop(suite.ctx)
	suite.Require().NoError(err)

	moduleAccAddr := suite.app.AccountKeeper.GetModuleAddress(types.ModuleName)
	coins := suite.app.BankKeeper.GetBalance(suite.ctx, moduleAccAddr, sdk.DefaultBondDenom)
	suite.Require().Equal(coins, sdk.NewInt64Coin(sdk.DefaultBondDenom, 0))

	coins2, err = suite.app.ClaimKeeper.GetUserTotalClaimable(suite.ctx, addr2)
	suite.Require().NoError(err)
	suite.Require().EqualValues(sdk.Coin{}, coins2)

	// user 2 should have no coins for having not participated at all in the airdrop
	coins2 = suite.app.BankKeeper.GetBalance(suite.ctx, addr2, sdk.DefaultBondDenom)
	suite.Require().True(coins2.IsZero())
}

func (suite *KeeperTestSuite) TestClaimOfDecayed() {
	airdropStartTime := time.Now()
	durationUntilDecay := time.Hour
	durationOfDecay := time.Hour * 4

	pub1 := secp256k1.GenPrivKey().PubKey()
	addr1 := sdk.AccAddress(pub1.Address())

	claimRecords := []types.ClaimRecord{
		{
			Address:                addr1.String(),
			InitialClaimableAmount: sdk.NewInt64Coin(sdk.DefaultBondDenom, 1000),
			ActionCompleted:        []bool{false, false, false, false, false},
		},
	}

	tests := []struct {
		fn func()
	}{
		{
			fn: func() {
				ctx := suite.ctx.WithBlockTime(airdropStartTime)
				coins, err := suite.app.ClaimKeeper.GetClaimableAmountForAction(ctx, addr1, types.ActionActivate)
				suite.NoError(err)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), coins.Amount.String())

				_, err = suite.msgServer.Activate(sdk.WrapSDKContext(suite.ctx), types.NewMsgActivate(addr1.String()))
				suite.Require().NoError(err)
				coins = suite.app.BankKeeper.GetBalance(ctx, addr1, sdk.DefaultBondDenom)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), coins.Amount.String())
			},
		},
		{
			fn: func() {
				ctx := suite.ctx.WithBlockTime(airdropStartTime.Add(durationUntilDecay))
				coins, err := suite.app.ClaimKeeper.GetClaimableAmountForAction(ctx, addr1, types.ActionActivate)
				suite.NoError(err)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), coins.Amount.String())

				_, err = suite.msgServer.Activate(sdk.WrapSDKContext(suite.ctx), types.NewMsgActivate(addr1.String()))
				suite.Require().NoError(err)
				coins = suite.app.BankKeeper.GetBalance(ctx, addr1, sdk.DefaultBondDenom)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(5)).String(), coins.Amount.String())
			},
		},
		{
			fn: func() {
				ctx := suite.ctx.WithBlockTime(airdropStartTime.Add(durationUntilDecay).Add(durationOfDecay / 2))
				coins, err := suite.app.ClaimKeeper.GetClaimableAmountForAction(ctx, addr1, types.ActionActivate)
				suite.NoError(err)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(10)).String(), coins.Amount.String())

				_, err = suite.msgServer.Activate(sdk.WrapSDKContext(ctx), types.NewMsgActivate(addr1.String()))
				suite.Require().NoError(err)
				coins = suite.app.BankKeeper.GetBalance(ctx, addr1, sdk.DefaultBondDenom)
				suite.Equal(claimRecords[0].InitialClaimableAmount.Amount.Quo(sdk.NewInt(10)).String(), coins.Amount.String())
			},
		},
		{
			fn: func() {
				ctx := suite.ctx.WithBlockTime(airdropStartTime.Add(durationUntilDecay).Add(durationOfDecay))
				coins, err := suite.app.ClaimKeeper.GetClaimableAmountForAction(ctx, addr1, types.ActionActivate)
				suite.NoError(err)
				suite.True(coins.IsZero())

				_, err = suite.msgServer.Activate(sdk.WrapSDKContext(ctx), types.NewMsgActivate(addr1.String()))
				suite.Require().NoError(err)
				coins2 := suite.app.BankKeeper.GetBalance(ctx, addr1, sdk.DefaultBondDenom)
				suite.True(coins2.IsZero(), coins2.String())
			},
		},
	}

	for _, test := range tests {
		suite.SetupTest()

		err := suite.app.ClaimKeeper.SetParams(suite.ctx, types.Params{
			AirdropStartTime:   airdropStartTime,
			DurationUntilDecay: durationUntilDecay,
			DurationOfDecay:    durationOfDecay,
			ClaimDenom: sdk.DefaultBondDenom,
		})
		suite.NoError(err)

		suite.app.AccountKeeper.SetAccount(suite.ctx, authtypes.NewBaseAccount(addr1, nil, 0, 0))
		err = suite.app.ClaimKeeper.SetClaimRecords(suite.ctx, claimRecords)
		suite.Require().NoError(err)

		test.fn()
	}
}
