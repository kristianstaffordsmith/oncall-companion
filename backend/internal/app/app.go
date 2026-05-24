package app

import (
	"context"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/handlers"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/services"
)

type App struct {
	Config Config
	DB     *pgxpool.Pool
	Router http.Handler
}

func New(ctx context.Context) (*App, error) {
	cfg := LoadConfig()

	if cfg.DatabaseURL == "" {
		return nil, errors.New("DATABASE_URL is required")
	}

	db, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}

	usersRepo := repository.NewUsersRepo(db)
	scheduleRepo := repository.NewScheduleRepo(db)

	scheduleSvc := services.NewScheduleService(scheduleRepo)

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	healthHandler := handlers.NewHealthHandler()
	meHandler := handlers.NewMeHandler(usersRepo)
	scheduleHandler := handlers.NewScheduleHandler(scheduleSvc)

	r.Get("/health", healthHandler.Get)
	r.Get("/me", meHandler.Get)
	r.Get("/schedule/current", scheduleHandler.Current)

	return &App{
		Config: cfg,
		DB:     db,
		Router: r,
	}, nil
}
