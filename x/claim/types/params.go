package types

import (
	"time"
)

var (
	DefaultClaimDenom         = "urook"
	DefaultDurationUntilDecay = 60 * 24 * time.Hour // 60 days
	DefaultDurationOfDecay    = 60 * 24 * time.Hour // 60 days
)
