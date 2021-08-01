package types

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	MinMapSize        = 10
	MaxMapSize        = 100
	MinTilesPerPlayer = 25
)

func DefaultConfig() *Config {
	return &Config{
		Initial: DefaultInitializationConfig(), // all on all
		Map:     DefaultMapConfig(),
	}
}

func (cfg *Config) ValidateBasic(players int) error {
	if cfg.Map != nil {
		if err := cfg.Map.ValidateBasic(); err != nil {
			return err
		}
	}

	if int(cfg.Map.Width*cfg.Map.Height)/players < MinTilesPerPlayer {
		sdkerrors.Wrapf(ErrInvalidMapSize, "must be at least %d tiles per player", MinTilesPerPlayer)
	}

	return nil
}

func (c *Config) AddSeed(seed int64) {
	c.Map.Seed = seed
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

	if cfg.Seed == 0 {
		return ErrSeedNotSet
	}

	return nil
}

func (cfg MapConfig) TotalDensity() int {
	return cfg.Terrain() + int(cfg.PlainsDensity)
}

func (cfg MapConfig) Terrain() int {
	return int(cfg.MountainsDensity + cfg.LakeDensity + cfg.ForestDensity)
}

func (cfg MapConfig) Area() int {
	return int(cfg.Width * cfg.Height)
}

// Params

func DefaultParams() Params {
	return Params{
		ProductionRate: []*ResourceSet{
			{}, // 0 is NONE
			{Wood: 0, Food: 0, Stone: 0, Population: 1}, // TOWN
			{Wood: 0, Food: 0, Stone: 0, Population: 2}, // CITY
			{Wood: 1, Food: 1, Stone: 1, Population: 2}, // CAPITAL
			{Wood: 2, Food: 0, Stone: 0, Population: 0}, // LUMBERMILL
			{Wood: 0, Food: 0, Stone: 2, Population: 0}, // QUARRY
			{Wood: 0, Food: 2, Stone: 0, Population: 0}, // FARM
			{}, // ROOK
		},
		ConstructionCost: []*ResourceSet{
			{},
			{Wood: 3, Food: 10, Stone: 5},   // TOWN
			{Wood: 8, Food: 12, Stone: 10},  // CITY
			{Wood: 10, Food: 20, Stone: 15}, // CAPITAL
			{Wood: 5, Food: 1, Stone: 2},    // LUMBERMILL
			{Wood: 9, Food: 1, Stone: 1},    // QUARRY
			{Wood: 8, Food: 3, Stone: 1},    // FARM
			{Wood: 0, Food: 5, Stone: 9},    // ROOK
		},
	}
}

func (p Params) ValidateBasic() error {
	return nil
}
