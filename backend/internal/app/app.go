package app

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/handlers"
)

type App struct {
	Config Config
	DB     *pgxpool.Pool
	Router http.Handler
}

func New(ctx context.Context) (*App, error) {
	cfg := LoadConfig()

	var db *pgxpool.Pool
	if cfg.DatabaseURL != "" {
		pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
		if err != nil {
			return nil, err
		}
		db = pool
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	healthHandler := handlers.NewHealthHandler()
	r.Get("/health", healthHandler.Get)

	return &App{
		Config: cfg,
		DB:     db,
		Router: r,
	}, nil
}
