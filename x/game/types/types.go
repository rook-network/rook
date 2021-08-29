package types

func NewPosition(x, y uint32) *Position {
	return &Position{X: x, Y: y}
}

func PositionFromIndex(index uint32, width uint32) *Position {
	return NewPosition(index%width, index/width)
}

func (p Position) Equals(pos *Position) bool {
	return p.X == pos.X && p.Y == pos.Y
}

// Resources

func NewResources(food, stone, wood, population uint32) *ResourceSet {
	return &ResourceSet{
		Food:       food,
		Wood:       wood,
		Stone:      stone,
		Population: population,
	}
}

func (r ResourceSet) CanAfford(res *ResourceSet) bool {
	return res == nil || r.Wood >= res.Wood && r.Food >= res.Food && r.Stone >= res.Stone
}

func (r *ResourceSet) Pay(res *ResourceSet) {
	if res == nil {
		return
	}
	r.Food -= res.Food
	r.Stone -= res.Stone
	r.Wood -= res.Wood
}

func (r *ResourceSet) Add(res *ResourceSet) {
	if res == nil {
		return
	}
	r.Food += res.Food
	r.Stone += res.Stone
	r.Wood += res.Wood
	r.Population += res.Population
}
