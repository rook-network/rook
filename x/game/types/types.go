package types

import "fmt"

func NewPosition(x, y uint32) *Position {
	return &Position{X: x, Y: y}
}

func PositionFromIndex(index uint32, width uint32) *Position {
	return NewPosition(index%width, index/width)
}

func (p Position) Equals(pos *Position) bool {
	return p.X == pos.X && p.Y == pos.Y
}

func (p Position) Print() string {
	return fmt.Sprintf("x: %d, y: %d", p.X, p.Y)
}

// Resources

func NewResources(food, stone, wood, population uint32) *ResourceSet {
	return &ResourceSet{
		Food:       food,
		Wood:       wood,
		Stone:      stone,
		Population: population,

		// This is currently not used but will be in the future
		Tech: 0,
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

func (r ResourceSet) IsNone() bool {
	return r.Food == 0 && r.Stone == 0 && r.Wood == 0 && r.Population == 0
}
