package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

const (
	DemoUserID      = "00000000-0000-0000-0000-000000000001"
	SecondaryUserID = "00000000-0000-0000-0000-000000000002"
	ManagerUserID   = "00000000-0000-0000-0000-000000000003"
)

type UsersRepo struct {
	db *pgxpool.Pool
}

func NewUsersRepo(db *pgxpool.Pool) *UsersRepo {
	return &UsersRepo{db: db}
}

func (r *UsersRepo) GetCurrentUser(ctx context.Context) (models.User, error) {
	userID, err := uuid.Parse(DemoUserID)
	if err != nil {
		return models.User{}, err
	}

	return r.GetByID(ctx, userID)
}

func (r *UsersRepo) GetByID(ctx context.Context, id uuid.UUID) (models.User, error) {
	var user models.User

	err := r.db.QueryRow(ctx, `
		SELECT id, name, email, avatar_url, role, created_at
		FROM users
		WHERE id = $1
	`, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.AvatarURL,
		&user.Role,
		&user.CreatedAt,
	)
	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
