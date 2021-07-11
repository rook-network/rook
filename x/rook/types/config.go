package types

func DefaultGameConfig() *GameConfig {
	return &GameConfig{
		Initial:      DefaultInitializationConfig(), // all on all
		Map:          DefaultMapConfig(),
		Production:   DefaultProductionRatesConfig(),
		Construction: DefaultSettlementCostsConfig(),
	}
}

func DefaultInitializationConfig() *InitializationConfig {
	return &InitializationConfig{
		Teams:      0, // free for all
		Resources:  &ResourceSet{Wood: 5, Food: 5, Stone: 5},
		Population: 1,
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
		LineOfSight:      1,
		RookLineOfSight:  3,
	}
}

func DefaultProductionRatesConfig() *ProductionRatesConfig {
	return &ProductionRatesConfig{
		Town:       1,
		City:       2,
		Lumbermill: 1,
		Quarry:     1,
		Farm:       1,
	}
}

func DefaultSettlementCostsConfig() *SettlementCostsConfig {
	return &SettlementCostsConfig{
		Town:       &ResourceSet{Wood: 2, Food: 3, Stone: 1},
		City:       &ResourceSet{Wood: 1, Food: 2, Stone: 1},
		Capital:    &ResourceSet{Wood: 0, Food: 2, Stone: 3},
		Farm:       &ResourceSet{Wood: 2, Food: 0, Stone: 2},
		Lumbermill: &ResourceSet{Wood: 3, Food: 0, Stone: 0},
		Quarry:     &ResourceSet{Wood: 4, Food: 0, Stone: 0},
		Rook:       &ResourceSet{Wood: 0, Food: 2, Stone: 2},
	}
}

func (c *GameConfig) AddSeed(seed int64) {
	c.Map.Seed = seed
}

// when handing over config to someone that only needs partial state
func (c GameConfig) WithoutSeed() GameConfig {
	return GameConfig{
		Initial: c.Initial,
		Map: &MapConfig{
			Width:           c.Map.Width,
			Height:          c.Map.Height,
			LineOfSight:     c.Map.LineOfSight,
			RookLineOfSight: c.Map.RookLineOfSight,
			Seed:            0,
		},
		Construction: c.Construction,
		Production:   c.Production,
	}
}
