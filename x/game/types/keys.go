package types

import (
	"encoding/binary"
	"fmt"
)

const (
	// ModuleName defines the module name
	ModuleName = "rook"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey is the message route for slashing
	RouterKey = ModuleName

	// QuerierRoute defines the module's query routing key
	QuerierRoute = ModuleName

	// this line is used by starport scaffolding # ibc/keys/name
)

// store subkeys
var (
	LatestGameIDKey        = []byte{0x00}
	GameOverviewKeyPrefix  = []byte{0x01}
	GameStateKeyPrefix     = []byte{0x02}
	LatestParamsVersionKey = []byte{0x03}
	ParamsKeyPrefix        = []byte{0x04}
)

func GameOverviewKey(gameID uint64) []byte {
	return append(GameOverviewKeyPrefix, GameIDBytes(gameID)...)
}

func GameStateKey(gameID uint64) []byte {
	return append(GameStateKeyPrefix, GameIDBytes(gameID)...)
}

func GameIDFromBytes(key []byte) uint64 {
	if len(key) != 9 {
		panic(fmt.Sprintf("unexpected key length; got: %d, expected: %d", len(key), 9))
	}

	return binary.BigEndian.Uint64(key[1:])
}

func GameIDBytes(gameID uint64) []byte {
	gameIDBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(gameIDBytes, gameID)
	return gameIDBytes
}

func ParamsKey(version uint32) []byte {
	paramsKeyBytes := make([]byte, 4)
	binary.BigEndian.PutUint32(paramsKeyBytes, version)
	return append(ParamsKeyPrefix, paramsKeyBytes...)
}

func ParamsVersionFromKey(key []byte) uint32 {
	if len(key) != 5 {
		panic(fmt.Sprintf("unexpected key length; got: %d, expected: %d", len(key), 5))
	}

	return binary.BigEndian.Uint32(key[1:])
}
