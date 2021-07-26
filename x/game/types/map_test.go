package types

import (
	"math"
	"math/rand"
	"testing"

	"github.com/stretchr/testify/require"
)

func MockMap(width, height int, landscape Landscape) *Map {
	tiles := make([]Landscape, width*height)
	for i := 0; i < width*height; i++ {
		tiles[i] = landscape
	}
	return &Map{
		Tiles: tiles,
		Width: uint32(width),
	}
}

func TestDirections(t *testing.T) {
	mock := MockMap(3, 3, Landscape_PLAINS)

	require.Equal(t, 7, mock.Above(1))
	require.Equal(t, 5, mock.Above(8))

	require.Equal(t, 0, mock.Below(6))
	require.Equal(t, 4, mock.Below(1))

	require.Equal(t, 5, mock.Left(3))
	require.Equal(t, 7, mock.Left(8))

	require.Equal(t, 0, mock.Right(2))
	require.Equal(t, 7, mock.Right(6))
}

func TestGetNeighbor(t *testing.T) {
	mock := MockMap(3, 3, Landscape_PLAINS)
	require.Equal(t, 2, mock.GetNeighbor(0, Direction_LEFT))
}

func TestGetPosition(t *testing.T) {
	mock := MockMap(3, 3, Landscape_PLAINS)
	require.Equal(t, NewPosition(2, 0), mock.GetPosition(2))
	require.Equal(t, NewPosition(0, 2), mock.GetPosition(6))
}

func TestFindPos(t *testing.T) {
	mock := MockMap(3, 3, Landscape_PLAINS)

	require.Equal(t, Position{X: 1, Y: 2}, mock.GetPosition(7))
	require.Equal(t, Position{X: 0, Y: 0}, mock.GetPosition(0))
}

func TestCalculateScore(t *testing.T) {
	mock := MockMap(3, 3, Landscape_FOREST)

	require.Equal(t, 9, calculateRouteScore(mock, 4))
	require.Equal(t, 9, calculateRouteScore(mock, 0))
	require.Equal(t, 9, calculateRouteScore(mock, 8))
}

func TestGenerateMap(t *testing.T) {
	config := DefaultMapConfig()
	config.Seed = 1234
	gameMap := GenerateMap(config)

	require.Equal(t, config.Width, gameMap.Width)
	require.Equal(t, int(config.Width*config.Height), len(gameMap.Tiles))

	tally := []int{0, 0, 0, 0, 0}
	for _, tile := range gameMap.Tiles {
		tally[tile]++
	}
	// none of the map should be unknown
	require.Zero(t, tally[Landscape_UNKNOWN])
	require.Greater(t, tally[Landscape_PLAINS], 50)
	require.Greater(t, tally[Landscape_LAKE], 50)
	require.Greater(t, tally[Landscape_FOREST], 50)
	require.Greater(t, tally[Landscape_MOUNTAINS], 50)

	// all plains should be connected with at least another one
	plains := make([]int, 0)
	for idx, tile := range gameMap.Tiles {
		if tile == Landscape_PLAINS {
			plains = append(plains, idx)
		}
	}

	for _, plainIdx := range plains {
		neigborPlainFound := false
		for _, direction := range Directions {
			if gameMap.GetNeighborLandscape(plainIdx, direction) == Landscape_PLAINS {
				neigborPlainFound = true
			}
		}
		require.True(t, neigborPlainFound)
	}

	// making a nother map with the same seed should result in the exact same
	// map
	gameMap2 := GenerateMap(config)
	require.True(t, gameMap.Equal(gameMap2))
}

func TestStartingPoints(t *testing.T) {
	config := DefaultMapConfig()
	config.Seed = 5678
	gameMap := GenerateMap(config)
	r := rand.New(rand.NewSource(config.Seed))

	startingPoints, err := gameMap.RandomStartingPoints(r, 4)
	require.NoError(t, err)
	require.Len(t, startingPoints, 4)

	// assert that no points are within two squares of one another
	for i, pointA := range startingPoints {
		for j, pointB := range startingPoints {
			if i == j {
				continue
			}
			if math.Abs(float64(pointA.X)-float64(pointB.X)) <= 2 &&
				math.Abs(float64(pointA.Y)-float64(pointB.Y)) <= 2 {
				t.Fatalf("starting point (x: %d, y: %d) too close to other point (x: %d, y: %d)",
					pointA.X, pointA.Y, pointB.X, pointB.Y)
			}
		}
	}
}
