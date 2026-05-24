package services

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

var (
	ErrInvalidAlertInput      = errors.New("invalid alert input")
	ErrAlertNotFound          = errors.New("alert not found")
	ErrInvalidAlertTransition = errors.New("invalid alert state transition")
	ErrNoPendingEscalation    = errors.New("no pending escalation")
)

type AlertService struct {
	alertsRepo      *repository.AlertsRepo
	escalationSvc   *EscalationService
	notificationSvc *NotificationService
}

func NewAlertService(
	alertsRepo *repository.AlertsRepo,
	escalationSvc *EscalationService,
	notificationSvc *NotificationService,
) *AlertService {
	return &AlertService{
		alertsRepo:      alertsRepo,
		escalationSvc:   escalationSvc,
		notificationSvc: notificationSvc,
	}
}

type CreateAlertInput struct {
	Title             string
	ServiceName       string
	Environment       string
	Severity          string
	Source            string
	Summary           string
	MetricName        *string
	Threshold         *string
	CurrentValue      *string
	AffectedCustomers *string
	RunbookURL        *string
	DashboardURL      *string
	LogsURL           *string
}

func (s *AlertService) CreateFromWebhook(ctx context.Context, input CreateAlertInput) (models.Alert, error) {
	if !input.Valid() {
		return models.Alert{}, ErrInvalidAlertInput
	}

	tx, err := s.alertsRepo.Begin(ctx)
	if err != nil {
		return models.Alert{}, err
	}
	defer tx.Rollback(ctx)

	alert, err := s.alertsRepo.Create(ctx, tx, models.Alert{
		ID:                uuid.New(),
		Title:             strings.TrimSpace(input.Title),
		ServiceName:       strings.TrimSpace(input.ServiceName),
		Environment:       strings.TrimSpace(input.Environment),
		Severity:          input.Severity,
		Status:            "triggered",
		Source:            strings.TrimSpace(input.Source),
		Summary:           strings.TrimSpace(input.Summary),
		MetricName:        input.MetricName,
		Threshold:         input.Threshold,
		CurrentValue:      input.CurrentValue,
		AffectedCustomers: input.AffectedCustomers,
		RunbookURL:        input.RunbookURL,
		DashboardURL:      input.DashboardURL,
		LogsURL:           input.LogsURL,
		TriggeredAt:       time.Now().UTC(),
	})
	if err != nil {
		return models.Alert{}, err
	}

	if err := s.escalationSvc.CreateForAlert(ctx, tx, alert); err != nil {
		return models.Alert{}, err
	}

	userID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return models.Alert{}, err
	}

	if err := s.notificationSvc.CreateAlertNotification(ctx, tx, userID, alert); err != nil {
		return models.Alert{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.Alert{}, err
	}

	return alert, nil
}

func (s *AlertService) List(ctx context.Context) ([]models.Alert, error) {
	return s.alertsRepo.List(ctx)
}

func (s *AlertService) GetDetail(ctx context.Context, id uuid.UUID) (models.AlertDetail, error) {
	alert, err := s.alertsRepo.GetByID(ctx, id)
	if err != nil {
		return models.AlertDetail{}, err
	}

	escalationEvents, err := s.alertsRepo.ListEscalationEvents(ctx, id)
	if err != nil {
		return models.AlertDetail{}, err
	}

	return models.AlertDetail{
		Alert:            alert,
		EscalationEvents: escalationEvents,
	}, nil
}

func (s *AlertService) Acknowledge(ctx context.Context, id uuid.UUID) (models.Alert, error) {
	tx, err := s.alertsRepo.Begin(ctx)
	if err != nil {
		return models.Alert{}, err
	}
	defer tx.Rollback(ctx)

	alert, err := s.alertsRepo.GetByID(ctx, id)
	if err != nil {
		return models.Alert{}, mapAlertLookupError(err)
	}

	if alert.Status != "triggered" && alert.Status != "escalated" {
		return models.Alert{}, ErrInvalidAlertTransition
	}

	userID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return models.Alert{}, err
	}

	updated, err := s.alertsRepo.Acknowledge(ctx, tx, id, userID, time.Now().UTC())
	if err != nil {
		return models.Alert{}, err
	}

	if err := s.alertsRepo.CancelPendingEscalations(ctx, tx, id); err != nil {
		return models.Alert{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.Alert{}, err
	}

	return updated, nil
}

func (s *AlertService) Resolve(ctx context.Context, id uuid.UUID) (models.Alert, error) {
	tx, err := s.alertsRepo.Begin(ctx)
	if err != nil {
		return models.Alert{}, err
	}
	defer tx.Rollback(ctx)

	alert, err := s.alertsRepo.GetByID(ctx, id)
	if err != nil {
		return models.Alert{}, mapAlertLookupError(err)
	}

	if alert.Status != "triggered" && alert.Status != "escalated" && alert.Status != "acknowledged" {
		return models.Alert{}, ErrInvalidAlertTransition
	}

	updated, err := s.alertsRepo.Resolve(ctx, tx, id, time.Now().UTC())
	if err != nil {
		return models.Alert{}, err
	}

	if err := s.alertsRepo.CancelPendingEscalations(ctx, tx, id); err != nil {
		return models.Alert{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.Alert{}, err
	}

	return updated, nil
}

func (s *AlertService) Escalate(ctx context.Context, id uuid.UUID) (models.Alert, error) {
	tx, err := s.alertsRepo.Begin(ctx)
	if err != nil {
		return models.Alert{}, err
	}
	defer tx.Rollback(ctx)

	alert, err := s.alertsRepo.GetByID(ctx, id)
	if err != nil {
		return models.Alert{}, mapAlertLookupError(err)
	}

	if alert.Status != "triggered" {
		return models.Alert{}, ErrInvalidAlertTransition
	}

	updated, err := s.alertsRepo.Escalate(ctx, tx, id)
	if err != nil {
		return models.Alert{}, err
	}

	nextEscalation, err := s.alertsRepo.MarkNextPendingEscalationNotified(ctx, tx, id)
	if err != nil {
		return models.Alert{}, mapPendingEscalationError(err)
	}

	if err := s.notificationSvc.CreateEscalationNotification(ctx, tx, nextEscalation.User.ID, updated); err != nil {
		return models.Alert{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.Alert{}, err
	}

	return updated, nil
}

func (input CreateAlertInput) Valid() bool {
	if strings.TrimSpace(input.Title) == "" {
		return false
	}

	if strings.TrimSpace(input.ServiceName) == "" {
		return false
	}

	if strings.TrimSpace(input.Environment) == "" {
		return false
	}

	if strings.TrimSpace(input.Source) == "" {
		return false
	}

	if strings.TrimSpace(input.Summary) == "" {
		return false
	}

	switch input.Severity {
	case "low", "medium", "high", "critical":
		return true
	default:
		return false
	}
}

func mapAlertLookupError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrAlertNotFound
	}

	return err
}

func mapPendingEscalationError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNoPendingEscalation
	}

	return err
}
