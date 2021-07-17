package types

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	MinMapSize = 10
	MaxMapSize = 100
)

func DefaultGameConfig() *GameConfig {
	return &GameConfig{
		Initial: DefaultInitializationConfig(), // all on all
		Map:     DefaultMapConfig(),
	}
}

func (cfg *GameConfig) ValidateBasic() error {
	if cfg.Map != nil {
		if err := cfg.Map.ValidateBasic(); err != nil {
			return err
		}
	}

	return nil
}

func DefaultInitializationConfig() *InitializationConfig {
	return &InitializationConfig{
		Teams:     0, // free for all
		Resources: &ResourceSet{Wood: 5, Food: 5, Stone: 5, Population: 1},
	}
}

func DefaultMapConfig() *MapConfig {
	return &MapConfig{
		Width:  20,
		Height: 20,
		// seed needs to be generated
		MountainsDensity: 3,
		LakeDensity:      3,
		ForestDensity:    4,
		PlainsDensity:    6,
	}
}

func (cfg MapConfig) ValidateBasic() error {
	if cfg.Width < MinMapSize {
		return sdkerrors.Wrapf(ErrInvalidMapSize, "width %d is smaller than minimum %d", cfg.Width, MinMapSize)
	}

	if cfg.Width > MaxMapSize {
		return sdkerrors.Wrapf(ErrInvalidMapSize, "width %d is greater than maximum %d", cfg.Width, MaxMapSize)
	}

	if cfg.Height < MinMapSize {
		return sdkerrors.Wrapf(ErrInvalidMapSize, "height %d is smaller than minimum %d", cfg.Height, MinMapSize)
	}

	if cfg.Height > MaxMapSize {
		return sdkerrors.Wrapf(ErrInvalidMapSize, "height %d is greater than maximum %d", cfg.Height, MaxMapSize)
	}

	return nil
}

func DefaultParams() *Params {
	return &Params{
		ProductionRate: map[uint32]*ResourceSet{
			// 0 is NONE
			1: {Wood: 0, Food: 0, Stone: 0, Population: 1}, // TOWN
			2: {Wood: 0, Food: 0, Stone: 0, Population: 2}, // CITY
			3: {Wood: 0, Food: 0, Stone: 0, Population: 2}, // CAPITAL
			4: {Wood: 1, Food: 0, Stone: 0, Population: 0}, // LUMBERMILL
			5: {Wood: 0, Food: 0, Stone: 1, Population: 0}, // QUARRY
			6: {Wood: 0, Food: 1, Stone: 0, Population: 0}, // FARM
			7: {},
		},
		ConstructionCost: map[uint32]*ResourceSet{
			// 0 is NONE
			1: {Wood: 2, Food: 3, Stone: 1},
			2: {Wood: 1, Food: 2, Stone: 1},
			3: {Wood: 0, Food: 2, Stone: 3},
			4: {Wood: 2, Food: 0, Stone: 2},
			5: {Wood: 3, Food: 0, Stone: 0},
			6: {Wood: 4, Food: 0, Stone: 0},
			7: {Wood: 0, Food: 2, Stone: 2},
		},
	}
}

func (c *GameConfig) AddSeed(seed int64) {
	c.Map.Seed = seed
}