package models

import (
	"time"

	"github.com/google/uuid"
)

type Incident struct {
	ID                 uuid.UUID  `json:"id"`
	Reference          string     `json:"reference"`
	Title              string     `json:"title"`
	ServiceName        string     `json:"service_name"`
	Severity           string     `json:"severity"`
	Status             string     `json:"status"`
	CreatedFromAlertID *uuid.UUID `json:"created_from_alert_id"`
	CreatedBy          uuid.UUID  `json:"created_by"`
	CreatedAt          time.Time  `json:"created_at"`
	ResolvedAt         *time.Time `json:"resolved_at"`
}

type IncidentUpdate struct {
	ID         uuid.UUID `json:"id"`
	IncidentID uuid.UUID `json:"incident_id"`
	AuthorID   uuid.UUID `json:"author_id"`
	Body       string    `json:"body"`
	CreatedAt  time.Time `json:"created_at"`
}

type IncidentDetail struct {
	Incident     Incident         `json:"incident"`
	Updates      []IncidentUpdate `json:"updates"`
	LinkedAlerts []Alert          `json:"linked_alerts"`
}
