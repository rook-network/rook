package types

import (
	"encoding/binary"
	"fmt"
)

const (
	// ModuleName defines the module name
	ModuleName = "game"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey is the message route for slashing
	RouterKey = ModuleName

	// QuerierRoute defines the module's query routing key
	QuerierRoute = ModuleName

	MemStoreKey = "mem_" + ModuleName

	// this line is used by starport scaffolding # ibc/keys/name
)

// store subkeys
var (
	GameIDKey          = []byte{0x00}
	GamePrefix         = []byte{0x01}
	GameOverviewPrefix = []byte{0x02}
	GameStatePrefix    = []byte{0x03}
	GamePlayerPrefix   = []byte{0x04}
	ParamsVersionKey   = []byte{0x05}
	ParamsPrefix       = []byte{0x06}
)

func GameKey(gamID uint64) []byte {
	return append(GamePrefix, GameIDBytes(gamID)...)
}

func GameOverviewKey(gameID uint64) []byte {
	return append(GameOverviewPrefix, GameIDBytes(gameID)...)
}

func GameStateKey(gameID uint64) []byte {
	return append(GameStatePrefix, GameIDBytes(gameID)...)
}

func GamePlayerKey(player string) []byte {
	return append(GamePlayerPrefix, []byte(player)...)
}

func ParseGameID(key []byte) uint64 {
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
	return append(ParamsPrefix, paramsKeyBytes...)
}

func ParseParamsVersion(key []byte) uint32 {
	if len(key) != 5 {
		panic(fmt.Sprintf("unexpected key length; got: %d, expected: %d", len(key), 5))
	}

	return binary.BigEndian.Uint32(key[1:])
}
