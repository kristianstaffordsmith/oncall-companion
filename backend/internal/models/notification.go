package models

import (
	"time"

	"github.com/google/uuid"
)

type NotificationEvent struct {
	ID        uuid.UUID  `json:"id"`
	UserID    uuid.UUID  `json:"user_id"`
	AlertID   *uuid.UUID `json:"alert_id"`
	Title     string     `json:"title"`
	Body      string     `json:"body"`
	Status    string     `json:"status"`
	CreatedAt time.Time  `json:"created_at"`
}
