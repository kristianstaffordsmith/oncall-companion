package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

type AlertsRepo struct {
	db *pgxpool.Pool
}

func NewAlertsRepo(db *pgxpool.Pool) *AlertsRepo {
	return &AlertsRepo{db: db}
}

func (r *AlertsRepo) Begin(ctx context.Context) (pgx.Tx, error) {
	return r.db.Begin(ctx)
}

func (r *AlertsRepo) Create(ctx context.Context, q Queryer, alert models.Alert) (models.Alert, error) {
	var created models.Alert

	err := q.QueryRow(ctx, `
		INSERT INTO alerts (
			id,
			title,
			service_name,
			environment,
			severity,
			status,
			source,
			summary,
			metric_name,
			threshold,
			current_value,
			affected_customers,
			runbook_url,
			dashboard_url,
			logs_url,
			triggered_at
		)
		VALUES (
			$1,
			$2,
			$3,
			$4,
			$5::severity,
			$6::alert_status,
			$7,
			$8,
			$9,
			$10,
			$11,
			$12,
			$13,
			$14,
			$15,
			$16
		)
		RETURNING
			id,
			title,
			service_name,
			environment,
			severity,
			status,
			source,
			summary,
			metric_name,
			threshold,
			current_value,
			affected_customers,
			runbook_url,
			dashboard_url,
			logs_url,
			triggered_at,
			acknowledged_at,
			acknowledged_by,
			resolved_at,
			linked_incident_id,
			created_at
	`,
		alert.ID,
		alert.Title,
		alert.ServiceName,
		alert.Environment,
		alert.Severity,
		alert.Status,
		alert.Source,
		alert.Summary,
		alert.MetricName,
		alert.Threshold,
		alert.CurrentValue,
		alert.AffectedCustomers,
		alert.RunbookURL,
		alert.DashboardURL,
		alert.LogsURL,
		alert.TriggeredAt,
	).Scan(
		&created.ID,
		&created.Title,
		&created.ServiceName,
		&created.Environment,
		&created.Severity,
		&created.Status,
		&created.Source,
		&created.Summary,
		&created.MetricName,
		&created.Threshold,
		&created.CurrentValue,
		&created.AffectedCustomers,
		&created.RunbookURL,
		&created.DashboardURL,
		&created.LogsURL,
		&created.TriggeredAt,
		&created.AcknowledgedAt,
		&created.AcknowledgedBy,
		&created.ResolvedAt,
		&created.LinkedIncidentID,
		&created.CreatedAt,
	)
	if err != nil {
		return models.Alert{}, err
	}

	return created, nil
}

func (r *AlertsRepo) List(ctx context.Context) ([]models.Alert, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			id,
			title,
			service_name,
			environment,
			severity,
			status,
			source,
			summary,
			metric_name,
			threshold,
			current_value,
			affected_customers,
			runbook_url,
			dashboard_url,
			logs_url,
			triggered_at,
			acknowledged_at,
			acknowledged_by,
			resolved_at,
			linked_incident_id,
			created_at
		FROM alerts
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	alerts := []models.Alert{}
	for rows.Next() {
		alert, err := scanAlert(rows)
		if err != nil {
			return nil, err
		}

		alerts = append(alerts, alert)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return alerts, nil
}

func (r *AlertsRepo) GetByID(ctx context.Context, id uuid.UUID) (models.Alert, error) {
	var alert models.Alert

	err := r.db.QueryRow(ctx, `
		SELECT
			id,
			title,
			service_name,
			environment,
			severity,
			status,
			source,
			summary,
			metric_name,
			threshold,
			current_value,
			affected_customers,
			runbook_url,
			dashboard_url,
			logs_url,
			triggered_at,
			acknowledged_at,
			acknowledged_by,
			resolved_at,
			linked_incident_id,
			created_at
		FROM alerts
		WHERE id = $1
	`, id).Scan(
		&alert.ID,
		&alert.Title,
		&alert.ServiceName,
		&alert.Environment,
		&alert.Severity,
		&alert.Status,
		&alert.Source,
		&alert.Summary,
		&alert.MetricName,
		&alert.Threshold,
		&alert.CurrentValue,
		&alert.AffectedCustomers,
		&alert.RunbookURL,
		&alert.DashboardURL,
		&alert.LogsURL,
		&alert.TriggeredAt,
		&alert.AcknowledgedAt,
		&alert.AcknowledgedBy,
		&alert.ResolvedAt,
		&alert.LinkedIncidentID,
		&alert.CreatedAt,
	)
	if err != nil {
		return models.Alert{}, err
	}

	return alert, nil
}

func (r *AlertsRepo) CreateEscalationEvent(ctx context.Context, q Queryer, event models.EscalationEvent, userID uuid.UUID) error {
	_, err := q.Exec(ctx, `
		INSERT INTO escalation_events (
			id,
			alert_id,
			user_id,
			level,
			notify_at,
			status
		)
		VALUES ($1, $2, $3, $4, $5, $6::escalation_event_status)
	`,
		event.ID,
		event.AlertID,
		userID,
		event.Level,
		event.NotifyAt,
		event.Status,
	)

	return err
}

func (r *AlertsRepo) ListEscalationEvents(ctx context.Context, alertID uuid.UUID) ([]models.EscalationEvent, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			e.id,
			e.alert_id,
			e.level,
			e.notify_at,
			e.status,
			e.created_at,
			u.id,
			u.name,
			u.email,
			u.avatar_url,
			u.role,
			u.created_at
		FROM escalation_events e
		JOIN users u ON u.id = e.user_id
		WHERE e.alert_id = $1
		ORDER BY e.level ASC
	`, alertID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []models.EscalationEvent{}
	for rows.Next() {
		var event models.EscalationEvent

		err := rows.Scan(
			&event.ID,
			&event.AlertID,
			&event.Level,
			&event.NotifyAt,
			&event.Status,
			&event.CreatedAt,
			&event.User.ID,
			&event.User.Name,
			&event.User.Email,
			&event.User.AvatarURL,
			&event.User.Role,
			&event.User.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}

func scanAlert(row pgx.Row) (models.Alert, error) {
	var alert models.Alert

	err := row.Scan(
		&alert.ID,
		&alert.Title,
		&alert.ServiceName,
		&alert.Environment,
		&alert.Severity,
		&alert.Status,
		&alert.Source,
		&alert.Summary,
		&alert.MetricName,
		&alert.Threshold,
		&alert.CurrentValue,
		&alert.AffectedCustomers,
		&alert.RunbookURL,
		&alert.DashboardURL,
		&alert.LogsURL,
		&alert.TriggeredAt,
		&alert.AcknowledgedAt,
		&alert.AcknowledgedBy,
		&alert.ResolvedAt,
		&alert.LinkedIncidentID,
		&alert.CreatedAt,
	)
	if err != nil {
		return models.Alert{}, err
	}

	return alert, nil
}
