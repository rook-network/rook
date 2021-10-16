package keeper_test

import "github.com/arcane-systems/rook/x/claim/types"

func (suite *KeeperTestSuite) TestParams() {
	params, err := suite.app.ClaimKeeper.GetParams(suite.ctx)
	suite.NoError(err)
	err = params.ValidateBasic()
	suite.NoError(err)

	newParams := types.Params{}
	err = suite.app.ClaimKeeper.SetParams(suite.ctx, newParams)
	suite.Error(err)
}
