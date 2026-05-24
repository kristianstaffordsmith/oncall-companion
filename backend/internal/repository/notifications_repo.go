package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

type NotificationsRepo struct {
	db *pgxpool.Pool
}

func NewNotificationsRepo(db *pgxpool.Pool) *NotificationsRepo {
	return &NotificationsRepo{db: db}
}

func (r *NotificationsRepo) Create(ctx context.Context, q Queryer, notification models.NotificationEvent) (models.NotificationEvent, error) {
	var created models.NotificationEvent

	err := q.QueryRow(ctx, `
		INSERT INTO notification_events (
			id,
			user_id,
			alert_id,
			title,
			body,
			status
		)
		VALUES ($1, $2, $3, $4, $5, $6::notification_status)
		RETURNING id, user_id, alert_id, title, body, status, created_at
	`,
		notification.ID,
		notification.UserID,
		notification.AlertID,
		notification.Title,
		notification.Body,
		notification.Status,
	).Scan(
		&created.ID,
		&created.UserID,
		&created.AlertID,
		&created.Title,
		&created.Body,
		&created.Status,
		&created.CreatedAt,
	)
	if err != nil {
		return models.NotificationEvent{}, err
	}

	return created, nil
}
