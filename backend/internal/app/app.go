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
	alertsRepo := repository.NewAlertsRepo(db)
	notificationsRepo := repository.NewNotificationsRepo(db)
	incidentsRepo := repository.NewIncidentsRepo(db)

	scheduleSvc := services.NewScheduleService(scheduleRepo)
	notificationSvc := services.NewNotificationService(notificationsRepo)
	escalationSvc := services.NewEscalationService(alertsRepo)
	alertSvc := services.NewAlertService(alertsRepo, escalationSvc, notificationSvc)
	incidentSvc := services.NewIncidentService(incidentsRepo, alertsRepo)
	aiSvc := services.NewAIService(services.AIConfig{
		OpenAIKey: cfg.OpenAIKey,
	})

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	healthHandler := handlers.NewHealthHandler()
	meHandler := handlers.NewMeHandler(usersRepo)
	scheduleHandler := handlers.NewScheduleHandler(scheduleSvc)
	webhookHandler := handlers.NewWebhookHandler(alertSvc)
	alertsHandler := handlers.NewAlertsHandler(alertSvc)
	incidentsHandler := handlers.NewIncidentsHandler(incidentSvc, aiSvc)

	r.Get("/health", healthHandler.Get)
	r.Get("/me", meHandler.Get)
	r.Get("/schedule/current", scheduleHandler.Current)
	r.Post("/webhooks/alerts", webhookHandler.ReceiveAlert)
	r.Get("/alerts", alertsHandler.List)
	r.Get("/alerts/{id}", alertsHandler.Get)
	r.Post("/alerts/{id}/acknowledge", alertsHandler.Acknowledge)
	r.Post("/alerts/{id}/resolve", alertsHandler.Resolve)
	r.Post("/alerts/{id}/escalate", alertsHandler.Escalate)
	r.Post("/alerts/{id}/create-incident", incidentsHandler.CreateFromAlert)
	r.Get("/incidents", incidentsHandler.List)
	r.Get("/incidents/{id}", incidentsHandler.Get)
	r.Post("/incidents/{id}/updates", incidentsHandler.AddUpdate)
	r.Post("/incidents/{id}/ai-summary", incidentsHandler.GenerateAISummary)

	return &App{
		Config: cfg,
		DB:     db,
		Router: r,
	}, nil
}
