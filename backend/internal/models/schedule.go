package models

import (
	"time"

	"github.com/google/uuid"
)

type Shift struct {
	ID       uuid.UUID `json:"id"`
	User     User      `json:"user"`
	StartsAt time.Time `json:"starts_at"`
	EndsAt   time.Time `json:"ends_at"`
	Role     string    `json:"role"`
}
