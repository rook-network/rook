package types

import (
	"time"

	game "github.com/cmwaters/rook/x/game/types"
)

func NewRoom(config *game.Config, pending []string, public bool, quorum, capacity uint32, created time.Time) Room {
	return Room{
		Config:   config,
		Players:  []string{},
		Pending:  pending,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
		Created:  created,
	}
}

func (r *Room) TryAddPlayer(player string) (bool, error) {
	if r.IsFull() {
		return false, ErrRoomIsFull
	}

	for _, p := range r.Players {
		if p == player {
			return false, ErrPlayerAlreadyInRoom
		}
	}

	pendingIdx := -1
	if !r.Public {
		exists := false
		for i, p := range r.Pending {
			if p == player {
				exists = true
				pendingIdx = i
				break
			}
		}
		if !exists {
			return false, ErrPlayerNotInvited
		}

		r.Pending = append(r.Pending[:pendingIdx], r.Pending[pendingIdx+1:]...)
	}

	r.Players = append(r.Players, player)

	return r.IsReady(), nil
}

func (r Room) IsFull() bool {
	return len(r.Players) == int(r.Capacity)
}

func (r Room) IsReady() bool {
	return len(r.Players) >= int(r.Quorum)
}

func (r *Room) ReadyUp(time time.Time) {
	r.Ready = time
}

func (r Room) MsgCreate() *game.MsgCreate {
	return &game.MsgCreate{
		Players: r.Players,
		Config: r.Config,
	}
}

func NewCommonRoom(modeID uint32, created time.Time) CommonRoom {
	return CommonRoom{
		ModeId:  modeID,
		Players: []string{},
		Created: created,
	}
}

func (r *CommonRoom) ToRoom(mode Mode) Room {
	return Room{
		Config:   mode.Config,
		Players:  r.Players,
		Pending:  []string{},
		Quorum:   mode.Quorum,
		Capacity: mode.Capacity,
		Created:  r.Created,
		Ready:    r.Ready,
	}
}

func (r *CommonRoom) TryAddPlayer(player string, mode Mode) (bool, bool, error) {
	if len(r.Players) == int(mode.Capacity) {
		return true, false, ErrRoomIsFull
	}

	for _, p := range r.Players {
		if p == player {
			return false, false, ErrPlayerAlreadyInRoom
		}
	}

	r.Players = append(r.Players, player)
	return len(r.Players) == int(mode.Capacity), len(r.Players) >= int(mode.Quorum), nil
}

func (r *CommonRoom) ReadyUp(time time.Time) {
	r.Ready = time
} 
