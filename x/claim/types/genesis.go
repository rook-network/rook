package types

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

type Actions []Action

// DefaultIndex is the default capability global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default Capability genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		Params: Params{
			AirdropStartTime:   time.Time{},
			DurationUntilDecay: DefaultDurationUntilDecay, // 2 month
			DurationOfDecay:    DefaultDurationOfDecay,    // 2 months
			ClaimDenom:         DefaultClaimDenom,         // urook
		},
		ClaimRecords: []ClaimRecord{},
	}
}

// GetGenesisStateFromAppState returns x/claims GenesisState given raw application
// genesis state.
func GetGenesisStateFromAppState(cdc codec.JSONCodec, appState map[string]json.RawMessage) *GenesisState {
	var genesisState GenesisState

	if appState[ModuleName] != nil {
		cdc.MustUnmarshalJSON(appState[ModuleName], &genesisState)
	}

	return &genesisState
}

// TotalClaimable calculates the total possible claimable airdrop allotment
func (gs GenesisState) TotalClaimable() sdk.Coin {
	totalClaimable := sdk.NewInt64Coin(gs.Params.ClaimDenom, 0)

	for _, claimRecord := range gs.ClaimRecords {
		totalClaimable = totalClaimable.Add(claimRecord.InitialClaimableAmount)
	}

	return totalClaimable
}

func (gs GenesisState) ValidateBasic() error {
	if err := gs.Params.ValidateBasic(); err != nil {
		return err 
	}

	for _, claimRecord := range gs.ClaimRecords {
		if claimRecord.InitialClaimableAmount.Denom != gs.Params.ClaimDenom {
			return fmt.Errorf("unexpected claim record denom: %v, wanted: %v", claimRecord.InitialClaimableAmount.Denom, gs.Params.ClaimDenom)
		}
	}

	return nil
}
