package types

import (
	"encoding/binary"
)

const (
	// ModuleName defines the module name
	ModuleName = "matchmaker"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey is the message route for slashing
	RouterKey = ModuleName

	// QuerierRoute defines the module's query routing key
	QuerierRoute = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_matchmaker"

	// this line is used by starport scaffolding # ibc/keys/name
)

// this line is used by starport scaffolding # ibc/keys/port

func KeyPrefix(p string) []byte {
	return []byte(p)
}

var (
	RoomIDKey           = []byte{0x00}
	RoomPrefixKey       = []byte{0x01}
	CommonRoomPrefixKey = []byte{0x02}
	ModeIDKey           = []byte{0x03}
	ModePrefixKey       = []byte{0x04}
)

func RoomKey(id uint64) []byte {
	return append(RoomPrefixKey, RoomIDBytes(id)...)
}

func CommonRoomKey(mode uint32) []byte {
	return append(CommonRoomPrefixKey, ModeIDBytes(mode)...)
}

func ParseRoomID(key []byte) uint64 {
	return binary.BigEndian.Uint64(key)
}

func RoomIDBytes(id uint64) []byte {
	idBz := make([]byte, 8)
	binary.BigEndian.PutUint64(idBz, id)
	return idBz
}

func ModeIDBytes(id uint32) []byte {
	idBz := make([]byte, 4)
	binary.BigEndian.PutUint32(idBz, id)
	return idBz
}

func ModeKey(mode uint32) []byte {
	return append(ModePrefixKey, ModeIDBytes(mode)...)
}

func ParseModeID(key []byte) uint32 {
	return binary.BigEndian.Uint32(key)
}
