package types

import (
	"errors"
	// this line is used by starport scaffolding # genesis/types/import
	// this line is used by starport scaffolding # ibc/genesistype/import
)

// DefaultIndex is the default capability global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default Capability genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		Params:     DefaultParams(),
		NextModeId: 1,
		NextRoomId: 1,
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {
	if gs.NextModeId == 0 {
		return errors.New("next mode id must be non nil")
	}

	if gs.NextRoomId == 0 {
		return errors.New("next room id must be non nil")
	}

	return gs.Params.ValidateBasic()
}
