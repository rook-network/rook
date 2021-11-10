package types

import (
	"fmt"
	"time"

	game "github.com/arcane-systems/rook/x/game/types"
)

const MaxRoomCapacity = 64

func NewCustomRoom(config game.Config, players, pending []string, public bool, quorum, capacity uint32, created time.Time) Room {
	return Room{
		Game: &Room_Config{
			Config: &config,
		},
		Players:  players,
		Pending:  pending,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
		Time:     &Room_Created{Created: &created},
	}
}

func NewStandardRoom(modeID uint32, players, pending []string, public bool, quorum, capacity uint32, created time.Time) Room {
	return Room{
		Game: &Room_ModeId{
			ModeId: modeID,
		},
		Players:  players,
		Pending:  pending,
		Public:   public,
		Quorum:   quorum,
		Capacity: capacity,
		Time:     &Room_Created{Created: &created},
	}
}

func (r *Room) Schedule(scheduled time.Time) {
	r.Time = &Room_Scheduled{Scheduled: &scheduled}
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
	for i, p := range r.Pending {
		if p == player {
			pendingIdx = i
			break
		}
	}
	// if it's a private game and the player hasn't been invited then return an error
	if !r.Public && pendingIdx == -1 {
		return ErrPlayerNotInvited
	}

	// if pending index was modified then update the pending. Note that this means that if
	// a player joins a room and then leaves they are unable to join again.
	if pendingIdx != -1 {
		r.Pending = append(r.Pending[:pendingIdx], r.Pending[pendingIdx+1:]...)
	}

	// update the player set
	r.Players = append(r.Players, player)

	return nil
}

func (r *Room) RemovePlayer(player string) {
	for idx, p := range r.Players {
		if p == player {
			r.Players = append(r.Players[:idx], r.Players[idx+1:]...)
			return
		}
	}
}

func (r Room) IsFull() bool {
	return len(r.Players) == int(r.Capacity)
}

func (r Room) IsEmpty() bool {
	return len(r.Players) == 0
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

// func (r Room) MsgCreate(randSource int64, mode *Mode) *game.MsgCreate {
// 	// If no seed has been set then set it using a deterministic random source
// 	if r.Config.Map.Seed == 0 {
// 		r.Config.Map.Seed = rand.NewSource(randSource).Int63()
// 	}
// 	return &game.MsgCreate{
// 		Players: r.Players,
// 		Config:  r.Config,
// 	}
// }

func NewMode(config game.Config, quorum, capacity uint32) Mode {
	return Mode{
		Config:   config,
		Quorum:   quorum,
		Capacity: capacity,
	}
}

func DefaultMode() Mode {
	return Mode{
		Config:   game.DefaultConfig(),
		Quorum:   2,
		Capacity: 4,
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

	if m.Capacity > MaxRoomCapacity {
		return fmt.Errorf("capacity (%d) exceeds max room capacity", m.Capacity)
	}

	if m.Quorum > m.Capacity {
		return fmt.Errorf("quorum (%d) must be less than or equal to capacity (%d)", m.Quorum, m.Capacity)
	}

	return nil
}
