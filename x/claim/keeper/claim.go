package keeper

import (
	"github.com/arcane-systems/rook/x/claim/types"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/gogo/protobuf/proto"
)

// GetModuleAccountBalance gets the airdrop coin balance of module account
func (k Keeper) GetModuleAccountAddress(ctx sdk.Context) sdk.AccAddress {
	return k.accountKeeper.GetModuleAddress(types.ModuleName)
}

// GetModuleAccountBalance gets the airdrop coin balance of module account
func (k Keeper) GetModuleAccountBalance(ctx sdk.Context) sdk.Coin {
	moduleAccAddr := k.GetModuleAccountAddress(ctx)
	params, _ := k.GetParams(ctx)
	return k.bankKeeper.GetBalance(ctx, moduleAccAddr, params.ClaimDenom)
}

// SetModuleAccountBalance set balance of airdrop module
func (k Keeper) CreateModuleAccount(ctx sdk.Context, amount sdk.Coin) {
	moduleAcc := authtypes.NewEmptyModuleAccount(types.ModuleName, authtypes.Minter, authtypes.Burner)
	k.accountKeeper.SetModuleAccount(ctx, moduleAcc)

	k.bankKeeper.MintCoins(ctx, types.ModuleName, sdk.NewCoins(amount))
}

// EndAirdrop burns all the remainin coins in the claim module and clears
// the initial claimables.
func (k Keeper) EndAirdrop(ctx sdk.Context) error {
	amt := sdk.NewCoins(k.GetModuleAccountBalance(ctx))
	if err := k.bankKeeper.BurnCoins(ctx, types.ModuleName, amt); err != nil {
		return err
	}
	k.clearInitialClaimables(ctx)
	return nil
}

// ClearClaimables clear claimable amounts
func (k Keeper) clearInitialClaimables(ctx sdk.Context) {
	store := ctx.KVStore(k.storeKey)
	iterator := sdk.KVStorePrefixIterator(store, []byte(types.ClaimRecordsStorePrefix))
	for ; iterator.Valid(); iterator.Next() {
		key := iterator.Key()
		store.Delete(key)
	}
	iterator.Close()
}

// SetClaimables set claimable amount from balances object
func (k Keeper) SetClaimRecords(ctx sdk.Context, claimRecords []types.ClaimRecord) error {
	for _, claimRecord := range claimRecords {
		err := k.SetClaimRecord(ctx, claimRecord)
		if err != nil {
			return err
		}
	}
	return nil
}

// GetClaimables get claimables for genesis export
func (k Keeper) GetClaimRecords(ctx sdk.Context) []types.ClaimRecord {
	store := ctx.KVStore(k.storeKey)
	prefixStore := prefix.NewStore(store, []byte(types.ClaimRecordsStorePrefix))

	iterator := prefixStore.Iterator(nil, nil)
	defer iterator.Close()

	claimRecords := []types.ClaimRecord{}
	for ; iterator.Valid(); iterator.Next() {

		claimRecord := types.ClaimRecord{}

		err := proto.Unmarshal(iterator.Value(), &claimRecord)
		if err != nil {
			panic(err)
		}

		claimRecords = append(claimRecords, claimRecord)
	}
	return claimRecords
}

// GetClaimRecord returns the claim record for a specific address
func (k Keeper) GetClaimRecord(ctx sdk.Context, addr sdk.AccAddress) (types.ClaimRecord, error) {
	store := ctx.KVStore(k.storeKey)
	prefixStore := prefix.NewStore(store, []byte(types.ClaimRecordsStorePrefix))
	if !prefixStore.Has(addr) {
		return types.ClaimRecord{}, nil
	}
	bz := prefixStore.Get(addr)

	claimRecord := types.ClaimRecord{}
	err := proto.Unmarshal(bz, &claimRecord)
	if err != nil {
		return types.ClaimRecord{}, err
	}

	return claimRecord, nil
}

// SetClaimRecord sets a claim record for an address in store
func (k Keeper) SetClaimRecord(ctx sdk.Context, claimRecord types.ClaimRecord) error {
	store := ctx.KVStore(k.storeKey)
	prefixStore := prefix.NewStore(store, []byte(types.ClaimRecordsStorePrefix))

	bz, err := proto.Marshal(&claimRecord)
	if err != nil {
		return err
	}

	addr, err := sdk.AccAddressFromBech32(claimRecord.Address)
	if err != nil {
		return err
	}

	prefixStore.Set(addr, bz)
	return nil
}

// GetClaimable returns claimable amount for a specific action done by an address
func (k Keeper) GetClaimableAmountForAction(ctx sdk.Context, addr sdk.AccAddress, action types.Action) (sdk.Coin, error) {
	claimRecord, err := k.GetClaimRecord(ctx, addr)
	if err != nil {
		return sdk.Coin{}, err
	}

	// check if the claimRecord exists
	if claimRecord.Address == "" {
		return sdk.Coin{}, types.ErrRecordNotFound
	}

	emptyClaim := sdk.NewInt64Coin(claimRecord.InitialClaimableAmount.Denom, 0)

	// if action already completed, nothing is claimable
	if claimRecord.ActionCompleted[action] {
		return emptyClaim, nil
	}

	params, err := k.GetParams(ctx)
	if err != nil {
		return sdk.Coin{}, err
	}

	// If we are before the start time, do nothing.
	// This case _shouldn't_ occur on chain, since the
	// start time ought to be chain start time.
	if ctx.BlockTime().Before(params.AirdropStartTime) {
		return emptyClaim, nil
	}

	InitialClaimablePerAction := sdk.NewCoin(
		claimRecord.InitialClaimableAmount.Denom,
		claimRecord.InitialClaimableAmount.Amount.QuoRaw(int64(len(types.Action_name))),
	)

	elapsedAirdropTime := ctx.BlockTime().Sub(params.AirdropStartTime)
	// Are we early enough in the airdrop s.t. theres no decay?
	if elapsedAirdropTime <= params.DurationUntilDecay {
		return InitialClaimablePerAction, nil
	}

	// The entire airdrop has completed
	if elapsedAirdropTime > params.DurationUntilDecay+params.DurationOfDecay {
		return emptyClaim, nil
	}

	// Positive, since goneTime > params.DurationUntilDecay
	decayTime := elapsedAirdropTime - params.DurationUntilDecay
	decayPercent := sdk.NewDec(decayTime.Nanoseconds()).QuoInt64(params.DurationOfDecay.Nanoseconds())
	claimablePercent := sdk.OneDec().Sub(decayPercent)

	return sdk.NewCoin(
		InitialClaimablePerAction.Denom,
		InitialClaimablePerAction.Amount.ToDec().Mul(claimablePercent).RoundInt(),
	), nil
}

// GetClaimable returns claimable amount for a specific action done by an address
func (k Keeper) GetUserTotalClaimable(ctx sdk.Context, addr sdk.AccAddress) (sdk.Coin, error) {
	claimRecord, err := k.GetClaimRecord(ctx, addr)
	if err != nil {
		return sdk.Coin{}, err
	}

	if claimRecord.Address == "" {
		return sdk.Coin{}, nil
	}

	totalClaimable := sdk.NewInt64Coin(claimRecord.InitialClaimableAmount.Denom, 0)
	for action := range types.Action_name {
		claimableForAction, err := k.GetClaimableAmountForAction(ctx, addr, types.Action(action))
		if err != nil {
			return sdk.Coin{}, err
		}
		totalClaimable = totalClaimable.Add(claimableForAction)
	}
	return totalClaimable, nil
}

// ClaimCoins remove claimable amount entry and transfer it to user's account
func (k Keeper) ClaimCoinsForAction(ctx sdk.Context, addr sdk.AccAddress, action types.Action) (sdk.Coin, error) {
	claimableAmount, err := k.GetClaimableAmountForAction(ctx, addr, action)
	if err != nil {
		return claimableAmount, err
	}

	if claimableAmount.IsZero() {
		return claimableAmount, nil
	}

	claimRecord, err := k.GetClaimRecord(ctx, addr)
	if err != nil {
		return sdk.Coin{}, err
	}

	if action != types.ActionActivate && !claimRecord.ActionCompleted[types.ActionActivate] {
		return sdk.Coin{}, types.ErrClaimInactive
	}

	err = k.bankKeeper.SendCoinsFromModuleToAccount(ctx, types.ModuleName, addr, sdk.NewCoins(claimableAmount))
	if err != nil {
		return sdk.Coin{}, err
	}

	claimRecord.ActionCompleted[action] = true

	err = k.SetClaimRecord(ctx, claimRecord)
	if err != nil {
		return claimableAmount, err
	}

	ctx.EventManager().EmitEvents(sdk.Events{
		sdk.NewEvent(
			types.EventTypeClaim,
			sdk.NewAttribute(sdk.AttributeKeySender, addr.String()),
			sdk.NewAttribute(sdk.AttributeKeyAmount, claimableAmount.String()),
		),
	})

	return claimableAmount, nil
}
