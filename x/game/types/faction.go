package types

func NewFaction(player string, resources *ResourceSet, startingPosition *Position) *Faction {
	return &Faction{
		Player:    player,
		Resources: resources,
		Population: []*Populace{
			{
				Amount:   resources.Population,
				Position: startingPosition,
			},
		},
	}

}

func (f *Faction) Reap() {

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
