package types

import (
	"fmt"
	"time"

	game "github.com/cmwaters/rook/x/game/types"
)

func NewRoom(config game.Config, players, pending []string, public bool, quorum, capacity uint32, created time.Time) Room {
	return Room{
		Config:   config,
		Players:  players,
		Pending:  pending,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
		Time:     &Room_Created{Created: &created},
	}
}

func NewScheduledRoom(config game.Config, players, pending []string, public bool, quorum, capacity uint32, scheduled time.Time) Room {
	return Room{
		Config:   config,
		Players:  players,
		Pending:  pending,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
		Time:     &Room_Scheduled{Scheduled: &scheduled},
	}
}

func (r *Room) TryAddPlayer(player string) error {
	if r.IsFull() {
		return ErrRoomIsFull
	}

	for _, p := range r.Players {
		if p == player {
			return ErrPlayerAlreadyInRoom
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
			return ErrPlayerNotInvited
		}

		r.Pending = append(r.Pending[:pendingIdx], r.Pending[pendingIdx+1:]...)
	}

	r.Players = append(r.Players, player)

	return nil
}

func (r Room) IsFull() bool {
	return len(r.Players) == int(r.Capacity)
}

func (r Room) HasQuorum() bool {
	return len(r.Players) >= int(r.Quorum)
}

func (r *Room) ReadyUp(time time.Time) {
	r.Time = &Room_Ready{Ready: &time}
}

func (r Room) HasExpired(now time.Time, lifespan time.Duration) bool {
	time, ok := r.Time.(*Room_Created)
	return ok && time.Created.Add(lifespan).After(now)
}

func (r Room) MsgCreate() *game.MsgCreate {
	return &game.MsgCreate{
		Players: r.Players,
		Config:  r.Config,
	}
}

func NewRoomSet(ids []uint64) Rooms {
	return Rooms{Ids: ids}
}

func (r *Rooms) Remove(id uint64) {
	removeIdx := -1
	for idx, roomID := range r.Ids {
		if roomID == id {
			removeIdx = idx
			break
		}
	}
	if removeIdx >= 0 {
		r.Ids = append(r.Ids[:removeIdx], r.Ids[removeIdx+1:]...)
	}
}

func (r *Rooms) Add(id uint64) {
	r.Ids = append(r.Ids, id)
}

func NewMode(config game.Config, quorum, capacity uint32) Mode {
	return Mode{
		Config:   config,
		Quorum:   quorum,
		Capacity: capacity,
	}
}

func (m Mode) ValidateBasic() error {
	if err := m.Config.ValidateBasic(int(m.Capacity)); err != nil {
		return err
	}

	if m.Capacity < 2 {
		return fmt.Errorf("capacity must be at least two got %d", m.Capacity)
	}

	if m.Quorum < 2 {
		return fmt.Errorf("quorum must be at least two got %d", m.Quorum)
	}

	if m.Quorum > m.Capacity {
		return fmt.Errorf("quorum (%d) must be less than equat to capacity (%d)", m.Quorum, m.Capacity)
	}

	return nil
}
