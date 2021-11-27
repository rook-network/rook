package types

import (
	"encoding/json"
	"fmt"
	"strings"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const (
	EventGame = "game.game"

	AttributeID            = "game_id"
	AttributeState         = "state"
	AttributePlayers       = "players"
	AttributeConfig        = "config"
	AttributeParamsVersion = "params_version"
	AttributeWinners       = "winners"
)

func NewGameEvent(gameID uint64, players []string, config Config, paramsVersion uint32) sdk.Event {
	configBytes, err := json.Marshal(config)
	if err != nil {
		panic(err)
	}
	return sdk.NewEvent(EventGame,
		sdk.NewAttribute(AttributeID, fmt.Sprintf("%d", gameID)),
		sdk.NewAttribute(AttributePlayers, strings.Join(players, ",")),
		sdk.NewAttribute(AttributeConfig, string(configBytes)),
		sdk.NewAttribute(AttributeParamsVersion, fmt.Sprintf("%d", paramsVersion)),
	)
}

func NewGameUpdatedEvent(gameID uint64, state *State) sdk.Event {
	stateBytes, err := json.Marshal(state)
	if err != nil {
		panic(err)
	}
	return sdk.NewEvent(EventGame,
		sdk.NewAttribute(AttributeID, fmt.Sprintf("%d", gameID)),
		sdk.NewAttribute(AttributeState, string(stateBytes)),
	)
}

func NewFinishedGameEvent(gameID uint64, winningFaction []string) sdk.Event {
	return sdk.NewEvent(EventGame,
		sdk.NewAttribute(AttributeID, fmt.Sprintf("%d", gameID)),
		sdk.NewAttribute(AttributeWinners, strings.Join(winningFaction, ",")),
	)
}
