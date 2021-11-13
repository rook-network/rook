package types

func NewFaction(players []string, resources *ResourceSet, startingPosition *Position) *Faction {
	return &Faction{
		Players:   players,
		Resources: resources,
		Population: []*Populace{
			{
				Amount:     resources.Population,
				Position:   startingPosition,
				Settlement: Settlement_CAPITAL,
			},
		},
	}

}

func (f Faction) HasPlayer(player string) bool {
	for _, p := range f.Players {
		if p == player {
			return true
		}
	}
	return false
}

func (f *Faction) Reap(params Params) {
	for _, pop := range f.Population {
		produce := params.ProductionRate[int(pop.Settlement)]
		f.Resources.Add(produce)
		pop.Amount += produce.Population
	}
}

func (f *Faction) FindPopulace() {

}

func (f *Faction) Capitals() int {
	count := 0
	for _, p := range f.Population {
		if p.Settlement == Settlement_CAPITAL {
			count++
		}
	}
	return count
}

func NewPopulace(amount uint32, pos *Position, settlement Settlement, used bool) *Populace {
	return &Populace{
		Amount:     amount,
		Position:   pos,
		Settlement: settlement,
		Used:       used,
	}
}
