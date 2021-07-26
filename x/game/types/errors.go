package types

// DONTCOVER

import (
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/rook module sentinel errors
var (
	ErrInvalidMapSize        = sdkerrors.Register(ModuleName, 1, "invalid map size")
	ErrGameCountNotSet       = sdkerrors.Register(ModuleName, 2, "game ID counter not set in genesis")
	ErrSeedNotSet            = sdkerrors.Register(ModuleName, 3, "game seed is not set (must be non zero)")
	ErrGameNotFound          = sdkerrors.Register(ModuleName, 4, "game can not be found")
	ErrPlayerNotInGame       = sdkerrors.Register(ModuleName, 5, "player is not a participant in game")
	ErrInvalidPopulaceIndex  = sdkerrors.Register(ModuleName, 6, "populace index exceeds factions population count")
	ErrInsufficientResources = sdkerrors.Register(ModuleName, 7, "faction has insufficient resources")
	ErrLumbermillLocation    = sdkerrors.Register(ModuleName, 8, "lumbermill must be built on top of a forest")
	ErrQuarryLocation        = sdkerrors.Register(ModuleName, 9, "quarry must be built next to a mountain")
	ErrInvalidSettlement     = sdkerrors.Register(ModuleName, 10, "settlement is invalid")
	ErrNotEnoughPopulation   = sdkerrors.Register(ModuleName, 11, "not enough population within populace")
	ErrUnpassableTerrain     = sdkerrors.Register(ModuleName, 12, "terrain is unpassable")
	ErrPopulaceAlreadActed   = sdkerrors.Register(ModuleName, 13, "players populace has already acted in this step")
	ErrAbandoningCapital     = sdkerrors.Register(ModuleName, 14, "not allowed to abandon capital")
	// this line is used by starport scaffolding # ibc/errors
)
