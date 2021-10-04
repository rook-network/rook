package keeper

import (
	"fmt"

	"github.com/arcane-systems/rook/x/claim/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	stakingtypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

func (k Keeper) AfterTrade(ctx sdk.Context, sender sdk.AccAddress) {
	_, err := k.ClaimCoinsForAction(ctx, sender, types.ActionTrade)
	switch err {
	case nil, types.ErrClaimInactive, types.ErrRecordNotFound:
	default:
		panic(fmt.Sprintf("AfterTrade: %s", err.Error()))
	}
}

func (k Keeper) AfterWonGame(ctx sdk.Context, sender sdk.AccAddress) {
	_, err := k.ClaimCoinsForAction(ctx, sender, types.ActionWin)
	switch err {
	case nil, types.ErrClaimInactive, types.ErrRecordNotFound:
	default:
		panic(fmt.Sprintf("AfterWonGame: %s", err.Error()))
	}
}

func (k Keeper) AfterPlayedGame(ctx sdk.Context, gameID uint64, voterAddr sdk.AccAddress) {
	_, err := k.ClaimCoinsForAction(ctx, voterAddr, types.ActionPlay)
	switch err {
	case nil, types.ErrClaimInactive, types.ErrRecordNotFound:
	default:
		panic(fmt.Sprintf("AfterPlayedGame: %s", err.Error()))
	}
}

func (k Keeper) AfterDelegationModified(ctx sdk.Context, delAddr sdk.AccAddress, valAddr sdk.ValAddress) {
	_, err := k.ClaimCoinsForAction(ctx, delAddr, types.ActionDelegate)
	switch err {
	case nil, types.ErrClaimInactive, types.ErrRecordNotFound:
	default:
		panic(fmt.Sprintf("AfterDelegationModified: %s", err.Error()))
	}
}

// ________________________________________________________________________________________

// Hooks wrapper struct for slashing keeper
type Hooks struct {
	k Keeper
}

var _ stakingtypes.StakingHooks = Hooks{}

// Return the wrapper struct
func (k Keeper) Hooks() Hooks {
	return Hooks{k}
}

// game hooks

// TODO: add game hooks

// staking hooks
func (h Hooks) AfterValidatorCreated(ctx sdk.Context, valAddr sdk.ValAddress)   {}
func (h Hooks) BeforeValidatorModified(ctx sdk.Context, valAddr sdk.ValAddress) {}
func (h Hooks) AfterValidatorRemoved(ctx sdk.Context, consAddr sdk.ConsAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) AfterValidatorBonded(ctx sdk.Context, consAddr sdk.ConsAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) AfterValidatorBeginUnbonding(ctx sdk.Context, consAddr sdk.ConsAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) BeforeDelegationCreated(ctx sdk.Context, delAddr sdk.AccAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) BeforeDelegationSharesModified(ctx sdk.Context, delAddr sdk.AccAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) BeforeDelegationRemoved(ctx sdk.Context, delAddr sdk.AccAddress, valAddr sdk.ValAddress) {
}
func (h Hooks) AfterDelegationModified(ctx sdk.Context, delAddr sdk.AccAddress, valAddr sdk.ValAddress) {
	h.k.AfterDelegationModified(ctx, delAddr, valAddr)
}
func (h Hooks) BeforeValidatorSlashed(ctx sdk.Context, valAddr sdk.ValAddress, fraction sdk.Dec) {}
