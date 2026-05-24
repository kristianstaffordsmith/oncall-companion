package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

type ScheduleRepo struct {
	db *pgxpool.Pool
}

func NewScheduleRepo(db *pgxpool.Pool) *ScheduleRepo {
	return &ScheduleRepo{db: db}
}

func (r *ScheduleRepo) GetCurrentShift(ctx context.Context, userID uuid.UUID) (models.Shift, error) {
	var shift models.Shift

	err := r.db.QueryRow(ctx, `
		SELECT
			s.id,
			s.starts_at,
			s.ends_at,
			s.role,
			u.id,
			u.name,
			u.email,
			u.avatar_url,
			u.role,
			u.created_at
		FROM shifts s
		JOIN users u ON u.id = s.user_id
		WHERE s.user_id = $1
			AND now() >= s.starts_at
			AND now() < s.ends_at
		ORDER BY s.starts_at DESC
		LIMIT 1
	`, userID).Scan(
		&shift.ID,
		&shift.StartsAt,
		&shift.EndsAt,
		&shift.Role,
		&shift.User.ID,
		&shift.User.Name,
		&shift.User.Email,
		&shift.User.AvatarURL,
		&shift.User.Role,
		&shift.User.CreatedAt,
	)
	if err != nil {
		return models.Shift{}, err
	}

	return shift, nil
}
