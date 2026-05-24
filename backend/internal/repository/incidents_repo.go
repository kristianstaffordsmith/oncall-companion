package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

type IncidentsRepo struct {
	db *pgxpool.Pool
}

func NewIncidentsRepo(db *pgxpool.Pool) *IncidentsRepo {
	return &IncidentsRepo{db: db}
}

func (r *IncidentsRepo) Begin(ctx context.Context) (pgx.Tx, error) {
	return r.db.Begin(ctx)
}

func (r *IncidentsRepo) Create(ctx context.Context, q Queryer, incident models.Incident) (models.Incident, error) {
	return scanIncident(q.QueryRow(ctx, `
		INSERT INTO incidents (
			id,
			reference,
			title,
			service_name,
			severity,
			status,
			created_from_alert_id,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5::severity, $6::incident_status, $7, $8)
		RETURNING
			id,
			reference,
			title,
			service_name,
			severity,
			status,
			created_from_alert_id,
			created_by,
			created_at,
			resolved_at
	`,
		incident.ID,
		incident.Reference,
		incident.Title,
		incident.ServiceName,
		incident.Severity,
		incident.Status,
		incident.CreatedFromAlertID,
		incident.CreatedBy,
	))
}

func (r *IncidentsRepo) List(ctx context.Context) ([]models.Incident, error) {
	rows, err := r.db.Query(ctx, `
		SELECT
			id,
			reference,
			title,
			service_name,
			severity,
			status,
			created_from_alert_id,
			created_by,
			created_at,
			resolved_at
		FROM incidents
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	incidents := []models.Incident{}
	for rows.Next() {
		incident, err := scanIncident(rows)
		if err != nil {
			return nil, err
		}

		incidents = append(incidents, incident)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return incidents, nil
}

func (r *IncidentsRepo) GetByID(ctx context.Context, id uuid.UUID) (models.Incident, error) {
	return scanIncident(r.db.QueryRow(ctx, `
		SELECT
			id,
			reference,
			title,
			service_name,
			severity,
			status,
			created_from_alert_id,
			created_by,
			created_at,
			resolved_at
		FROM incidents
		WHERE id = $1
	`, id))
}

func (r *IncidentsRepo) CreateUpdate(ctx context.Context, q Queryer, update models.IncidentUpdate) (models.IncidentUpdate, error) {
	var created models.IncidentUpdate

	err := q.QueryRow(ctx, `
		INSERT INTO incident_updates (
			id,
			incident_id,
			author_id,
			body
		)
		VALUES ($1, $2, $3, $4)
		RETURNING id, incident_id, author_id, body, created_at
	`,
		update.ID,
		update.IncidentID,
		update.AuthorID,
		update.Body,
	).Scan(
		&created.ID,
		&created.IncidentID,
		&created.AuthorID,
		&created.Body,
		&created.CreatedAt,
	)
	if err != nil {
		return models.IncidentUpdate{}, err
	}

	return created, nil
}

func (r *IncidentsRepo) ListUpdates(ctx context.Context, incidentID uuid.UUID) ([]models.IncidentUpdate, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, incident_id, author_id, body, created_at
		FROM incident_updates
		WHERE incident_id = $1
		ORDER BY created_at ASC
	`, incidentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	updates := []models.IncidentUpdate{}
	for rows.Next() {
		var update models.IncidentUpdate

		err := rows.Scan(
			&update.ID,
			&update.IncidentID,
			&update.AuthorID,
			&update.Body,
			&update.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		updates = append(updates, update)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return updates, nil
}

func (r *IncidentsRepo) ListLinkedAlerts(ctx context.Context, incidentID uuid.UUID) ([]models.Alert, error) {
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
		WHERE linked_incident_id = $1
		ORDER BY created_at ASC
	`, incidentID)
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

func scanIncident(row pgx.Row) (models.Incident, error) {
	var incident models.Incident

	err := row.Scan(
		&incident.ID,
		&incident.Reference,
		&incident.Title,
		&incident.ServiceName,
		&incident.Severity,
		&incident.Status,
		&incident.CreatedFromAlertID,
		&incident.CreatedBy,
		&incident.CreatedAt,
		&incident.ResolvedAt,
	)
	if err != nil {
		return models.Incident{}, err
	}

	return incident, nil
}
