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

func (f *Faction) Flush() {
	newPop := make([]*Populace, 0)
	for _, p := range f.Population {
		if p.Amount != 0 {
			newPop = append(newPop, p)
		}
	}
	f.Population = newPop
}

func (f *Faction) Reap(params Params) {
	for _, pop := range f.Population {
		produce := params.ProductionRate[int(pop.Settlement)]
		f.Resources.Add(produce)
		pop.Amount += produce.Population
	}
}

func (f Faction) IsEmpty() bool {
	return len(f.Population) == 0 && f.Resources.IsNone()
}

func (f *Faction) Merge(f2 *Faction) {
	f.Players = append(f.Players, f2.Players...)
	f.Resources.Add(f2.Resources)
	f.Population = append(f.Population, f2.Population...)
}

func (f *Faction) Sack(f2 *Faction) {
	f.Resources.Add(f2.Resources)
	f.Population = append(f.Population, f2.Population...)
	f2.Resources = NewResources(0, 0, 0, 0)
	f2.Population = make([]*Populace, 0)
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
