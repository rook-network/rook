package types

import (
	fmt "fmt"
	"time"

	yaml "gopkg.in/yaml.v2"

	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
)

const (
	DefaultRoomLifespan = time.Hour
	DefaultPrestartWaitPeriod = 10 * time.Second
)

var (
	KeyRoomLifespan       = []byte("RoomLifespan")
	KeyPrestartWaitPeriod = []byte("PrestartWaitPeriod")
)

var _ paramtypes.ParamSet = (*Params)(nil)

// ParamKeyTable for matchmaker module.
func ParamKeyTable() paramtypes.KeyTable {
	return paramtypes.NewKeyTable().RegisterParamSet(&Params{})
}

func NewParams(PreStartWaitPeriod, RoomLifespan time.Duration) Params {
	return Params{
		RoomLifespan: RoomLifespan,
		PrestartWaitPeriod: PreStartWaitPeriod,
	}
}

func DefaultParams() Params {
	return NewParams(DefaultPrestartWaitPeriod, DefaultRoomLifespan)
}

// String returns a human readable string representation of the parameters.
func (p Params) String() string {
	out, _ := yaml.Marshal(p)
	return string(out)
}

func (p Params) ValidateBasic() error {
	if p.RoomLifespan <= p.PrestartWaitPeriod {
		return fmt.Errorf("room lifespan (%v) is less than the prestart wait period (%v)",
			p.RoomLifespan, p.PrestartWaitPeriod,
		)
	}
	return nil
}

func (p *Params) ParamSetPairs() paramtypes.ParamSetPairs {
	return paramtypes.ParamSetPairs{
		paramtypes.NewParamSetPair(KeyRoomLifespan, &p.RoomLifespan, validateDuration),
		paramtypes.NewParamSetPair(KeyPrestartWaitPeriod, &p.PrestartWaitPeriod, validateDuration),
	}
}

func validateDuration(i interface{}) error {
	v, ok := i.(time.Duration)
	if !ok {
		return fmt.Errorf("invalid parameter type: %T", i)
	}

	if v <= 0 {
		return fmt.Errorf("duration must be positive: %d", v)
	}

	return nil
}