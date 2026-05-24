package models

import (
	"time"

	"github.com/google/uuid"
)

type Alert struct {
	ID                uuid.UUID  `json:"id"`
	Title             string     `json:"title"`
	ServiceName       string     `json:"service_name"`
	Environment       string     `json:"environment"`
	Severity          string     `json:"severity"`
	Status            string     `json:"status"`
	Source            string     `json:"source"`
	Summary           string     `json:"summary"`
	MetricName        *string    `json:"metric_name"`
	Threshold         *string    `json:"threshold"`
	CurrentValue      *string    `json:"current_value"`
	AffectedCustomers *string    `json:"affected_customers"`
	RunbookURL        *string    `json:"runbook_url"`
	DashboardURL      *string    `json:"dashboard_url"`
	LogsURL           *string    `json:"logs_url"`
	TriggeredAt       time.Time  `json:"triggered_at"`
	AcknowledgedAt    *time.Time `json:"acknowledged_at"`
	AcknowledgedBy    *uuid.UUID `json:"acknowledged_by"`
	ResolvedAt        *time.Time `json:"resolved_at"`
	LinkedIncidentID  *uuid.UUID `json:"linked_incident_id"`
	CreatedAt         time.Time  `json:"created_at"`
}

type EscalationEvent struct {
	ID        uuid.UUID `json:"id"`
	AlertID   uuid.UUID `json:"alert_id"`
	User      User      `json:"user"`
	Level     int       `json:"level"`
	NotifyAt  time.Time `json:"notify_at"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
}

type AlertDetail struct {
	Alert            Alert             `json:"alert"`
	EscalationEvents []EscalationEvent `json:"escalation_events"`
}
