package types

import (
	"errors"
	"fmt"
	"math/rand"
)

var (
	Directions = []Direction{Direction_LEFT, Direction_RIGHT, Direction_UP, Direction_DOWN}
)

// GenerateMap creates a map given the dimensions of the config and populates it
// with landscapes that roughly equate to the provided densities. The generated
// map must connect all passable terrain. This means that no parts can be closed
// off.
func GenerateMap(config *MapConfig) *Map {
	// create random generator from seed
	r := rand.New(rand.NewSource(config.Seed))

	gameMap := &Map{
		Tiles: make([]Landscape, config.Width*config.Height),
		Width: config.Width,
	}

	// fill the map with unpassable terrain
	fillMapWithTerrain(gameMap, r, config)

	// creates paths out of passable terrain
	fillMapWithPaths(gameMap, r, config)

	return gameMap
}

func (m *Map) GetLandscape(position *Position) Landscape {
	return m.Tiles[position.Y*m.Width+position.X]
}

func (m *Map) Above(index uint32) uint32 {
	return (index - m.Width + m.Len()) % m.Len()
}

func (m *Map) Below(index uint32) uint32 {
	return (index + m.Width) % m.Len()
}

func (m *Map) Left(index uint32) uint32 {
	if index%m.Width == 0 {
		return index + m.Width - 1
	}
	return index - 1
}

func (m *Map) Right(index uint32) uint32 {
	if index%m.Width == m.Width-1 {
		return index - (m.Width - 1)
	}
	return index + 1
}

func (m *Map) GetPosition(index uint32) *Position {
	return &Position{X: uint32(index) % m.Width, Y: uint32(index) / m.Width}
}

func (m *Map) GetIndex(pos *Position) uint32 {
	return pos.Y*m.Width + pos.X
}

func (m *Map) GetNeighbor(index uint32, direction Direction) uint32 {
	switch direction {
	case Direction_RIGHT:
		return m.Right(index)
	case Direction_LEFT:
		return m.Left(index)
	case Direction_UP:
		return m.Above(index)
	case Direction_DOWN:
		return m.Below(index)
	default:
		panic(fmt.Sprintf("unknown direction %v", direction))
	}
}

func (m *Map) GetNeighborLandscape(index uint32, direction Direction) Landscape {
	return m.Tiles[m.GetNeighbor(index, direction)]
}

func (m *Map) Len() uint32 {
	return uint32(len(m.Tiles))
}

func (m *Map) Equal(m2 *Map) bool {
	if m.Width != m2.Width {
		return false
	}

	if len(m.Tiles) != len(m2.Tiles) {
		return false
	}

	for idx, tile := range m.Tiles {
		if tile != m2.Tiles[idx] {
			return false
		}
	}

	return true
}

func (m *Map) RandomStartingPoints(r *rand.Rand, amount int) ([]*Position, error) {
	points := make([]*Position, 0)
	pointMap := make(map[*Position]struct{})
	// loop through and find all the possible starting positions
	for idx, tile := range m.Tiles {
		if tile == Landscape_PLAINS {
			pos := m.GetPosition(uint32(idx))
			points = append(points, pos)
			pointMap[pos] = struct{}{}
		}
	}

	positions := make([]*Position, amount)
	for i := 0; i < amount; i++ {
		found := false
		attempts := 0
		for !found && attempts < 50 {
			pos := points[r.Intn(len(points))]
			if _, ok := pointMap[pos]; ok {
				positions[i] = pos
				found = true
				// delete all the surrounding positions as possible options.
				// This prevents two starting points from being that close to
				// one another.
				for x := int(pos.X) - 2; x < int(pos.X)+2; x++ {
					for y := int(pos.Y) - 2; y < int(pos.Y)+2; y++ {
						deletedPos := m.NormalizePosition(x, y)
						delete(pointMap, deletedPos)
					}
				}
			}
			attempts++
		}
		// this should rarely happen, but in this case we have not been able to
		// find in 50 attempts a starting position. FIXME: this strategy
		// isn't efficient for many players
		if !found {
			return positions, errors.New("unable to find a suitable starting position. Consider making the map larger")
		}
	}

	return positions, nil
}

func (m *Map) Print() string {
	str := "Map:"
	for i := 0; i < len(m.Tiles); i++ {
		if i%int(m.Width) == 0 {
			str += "\n"
		}
		switch m.Tiles[i] {
		case Landscape_PLAINS:
			str += " P "
		case Landscape_MOUNTAINS:
			str += " M "
		case Landscape_LAKE:
			str += " L "
		case Landscape_FOREST:
			str += " F "
		default:
			str += " U "
		}
	}
	return str
}

func (m *Map) NormalizePosition(x, y int) *Position {
	width := int(m.Width)
	height := len(m.Tiles) / width

	normX := (x + width) % width
	normY := (y + height) % height
	return &Position{X: uint32(normX), Y: uint32(normY)}
}

func fillMapWithTerrain(gameMap *Map, r *rand.Rand, config *MapConfig) {
	size := config.Terrain()
	for i := 0; i < config.Area(); i++ {
		v := uint32(r.Intn(size))
		switch {
		case v < config.MountainsDensity:
			gameMap.Tiles[i] = Landscape_MOUNTAINS
		case v >= config.MountainsDensity+config.ForestDensity:
			gameMap.Tiles[i] = Landscape_LAKE
		default:
			gameMap.Tiles[i] = Landscape_FOREST
		}
	}
}

func fillMapWithPaths(gameMap *Map, r *rand.Rand, config *MapConfig) {
	current := randomPoint(gameMap, r)
	amount := int(config.PlainsDensity) * config.Area() / config.TotalDensity()
	for i := 0; i < amount; i++ {
		next := getNextTile(gameMap, r, current)
		gameMap.Tiles[next] = Landscape_PLAINS
		current = next
	}

}

func getNextTile(gameMap *Map, r *rand.Rand, current uint32) (next uint32) {
	routes := getViableRoutes(gameMap, current)
	if len(routes) == 0 {
		newPoint := findNewPoint(gameMap, r)
		return getNextTile(gameMap, r, newPoint)
	}

	totalScore := 0
	for _, route := range routes {
		score := calculateRouteScore(gameMap, route.index)
		totalScore += score
		route.score = score
	}

	if totalScore == 0 {
		newPoint := findNewPoint(gameMap, r)
		return getNextTile(gameMap, r, newPoint)
	}

	choice := r.Intn(totalScore)
	cumulative := 0
	for _, route := range routes {
		cumulative += route.score
		if choice < cumulative {
			return route.index
		}
	}
	return routes[0].index
}

// findNewPoint loops through all the tiles in the map, collecting all
// the ones that are PLAINS, then picks a random plain and returns the index
func findNewPoint(gameMap *Map, r *rand.Rand) uint32 {
	points := make([]uint32, 0)
	for idx, tile := range gameMap.Tiles {
		if tile == Landscape_PLAINS {
			points = append(points, uint32(idx))
		}
	}
	return points[r.Intn(len(points))]
}

type route struct {
	direction Direction
	index     uint32
	score     int
}

func getViableRoutes(gameMap *Map, index uint32) []*route {
	routes := make([]*route, 0)
	for _, direction := range Directions {
		neighbor := gameMap.GetNeighbor(index, direction)
		if gameMap.Tiles[neighbor] != Landscape_PLAINS {
			routes = append(routes, &route{direction, neighbor, 0})
		}
	}
	return routes
}

func randomPoint(gameMap *Map, r *rand.Rand) uint32 {
	return uint32(r.Intn(len(gameMap.Tiles)))
}

func calculateRouteScore(gameMap *Map, index uint32) int {
	score := 0
	pos := gameMap.GetPosition(index)
	for x := int(pos.X) - 1; x <= int(pos.X)+1; x++ {
		for y := int(pos.Y) - 1; y <= int(pos.Y)+1; y++ {
			p := gameMap.NormalizePosition(x, y)
			if gameMap.GetLandscape(p) != Landscape_PLAINS {
				score++
			}
		}
	}
	return score
}
