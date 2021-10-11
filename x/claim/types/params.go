package types

import (
	"errors"
	"time"
)

var (
	DefaultClaimDenom         = "urook"
	DefaultDurationUntilDecay = 60 * 24 * time.Hour // 60 days
	DefaultDurationOfDecay    = 60 * 24 * time.Hour // 60 days
)

func (p Params) ValidateBasic() error {
	if p.ClaimDenom == "" {
		return errors.New("empty denom set for claims")
	}

	if p.DurationOfDecay == 0 && p.DurationUntilDecay == 0 {
		return errors.New("no claim durations set")
	}

	return nil
}