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

func (r ResourceSet) CanAfford(res *ResourceSet) bool {
	return res == nil || r.Wood >= res.Wood && r.Food >= res.Food && r.Stone >= res.Stone
}

func (r *ResourceSet) Pay(res *ResourceSet) {
	if res == nil {
		return
	}
	r.Wood -= res.Wood
	r.Food -= res.Food
	r.Stone -= res.Stone
}
