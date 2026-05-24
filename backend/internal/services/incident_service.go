package services

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

var (
	ErrIncidentNotFound      = errors.New("incident not found")
	ErrIncidentAlreadyExists = errors.New("incident already exists for alert")
	ErrInvalidIncidentInput  = errors.New("invalid incident input")
)

type IncidentService struct {
	incidentsRepo *repository.IncidentsRepo
	alertsRepo    *repository.AlertsRepo
}

func NewIncidentService(incidentsRepo *repository.IncidentsRepo, alertsRepo *repository.AlertsRepo) *IncidentService {
	return &IncidentService{
		incidentsRepo: incidentsRepo,
		alertsRepo:    alertsRepo,
	}
}

type CreateIncidentFromAlertInput struct {
	Title    *string
	Severity *string
}

type AddIncidentUpdateInput struct {
	Body string
}

func (s *IncidentService) CreateFromAlert(
	ctx context.Context,
	alertID uuid.UUID,
	input CreateIncidentFromAlertInput,
) (models.IncidentDetail, error) {
	alert, err := s.alertsRepo.GetByID(ctx, alertID)
	if err != nil {
		return models.IncidentDetail{}, mapIncidentAlertLookupError(err)
	}

	if alert.LinkedIncidentID != nil {
		return models.IncidentDetail{}, ErrIncidentAlreadyExists
	}

	userID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return models.IncidentDetail{}, err
	}

	incidentID := uuid.New()
	title := alert.Title
	if input.Title != nil && strings.TrimSpace(*input.Title) != "" {
		title = strings.TrimSpace(*input.Title)
	}

	severity := alert.Severity
	if input.Severity != nil && strings.TrimSpace(*input.Severity) != "" {
		requestedSeverity := strings.TrimSpace(*input.Severity)
		if !validSeverity(requestedSeverity) {
			return models.IncidentDetail{}, ErrInvalidIncidentInput
		}
		severity = requestedSeverity
	}

	tx, err := s.incidentsRepo.Begin(ctx)
	if err != nil {
		return models.IncidentDetail{}, err
	}
	defer tx.Rollback(ctx)

	incident, err := s.incidentsRepo.Create(ctx, tx, models.Incident{
		ID:                 incidentID,
		Reference:          incidentReference(incidentID),
		Title:              title,
		ServiceName:        alert.ServiceName,
		Severity:           severity,
		Status:             "investigating",
		CreatedFromAlertID: &alert.ID,
		CreatedBy:          userID,
	})
	if err != nil {
		return models.IncidentDetail{}, err
	}

	linked, err := s.alertsRepo.LinkIncident(ctx, tx, alert.ID, incident.ID)
	if err != nil {
		return models.IncidentDetail{}, err
	}
	if !linked {
		return models.IncidentDetail{}, ErrIncidentAlreadyExists
	}

	_, err = s.incidentsRepo.CreateUpdate(ctx, tx, models.IncidentUpdate{
		ID:         uuid.New(),
		IncidentID: incident.ID,
		AuthorID:   userID,
		Body:       "Incident created from alert: " + alert.Title,
	})
	if err != nil {
		return models.IncidentDetail{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.IncidentDetail{}, err
	}

	return s.GetDetail(ctx, incident.ID)
}

func (s *IncidentService) List(ctx context.Context) ([]models.Incident, error) {
	return s.incidentsRepo.List(ctx)
}

func (s *IncidentService) GetDetail(ctx context.Context, id uuid.UUID) (models.IncidentDetail, error) {
	incident, err := s.incidentsRepo.GetByID(ctx, id)
	if err != nil {
		return models.IncidentDetail{}, mapIncidentLookupError(err)
	}

	updates, err := s.incidentsRepo.ListUpdates(ctx, id)
	if err != nil {
		return models.IncidentDetail{}, err
	}

	linkedAlerts, err := s.incidentsRepo.ListLinkedAlerts(ctx, id)
	if err != nil {
		return models.IncidentDetail{}, err
	}

	return models.IncidentDetail{
		Incident:     incident,
		Updates:      updates,
		LinkedAlerts: linkedAlerts,
	}, nil
}

func (s *IncidentService) AddUpdate(ctx context.Context, incidentID uuid.UUID, input AddIncidentUpdateInput) (models.IncidentUpdate, error) {
	body := strings.TrimSpace(input.Body)
	if body == "" {
		return models.IncidentUpdate{}, ErrInvalidIncidentInput
	}

	if _, err := s.incidentsRepo.GetByID(ctx, incidentID); err != nil {
		return models.IncidentUpdate{}, mapIncidentLookupError(err)
	}

	userID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return models.IncidentUpdate{}, err
	}

	tx, err := s.incidentsRepo.Begin(ctx)
	if err != nil {
		return models.IncidentUpdate{}, err
	}
	defer tx.Rollback(ctx)

	update, err := s.incidentsRepo.CreateUpdate(ctx, tx, models.IncidentUpdate{
		ID:         uuid.New(),
		IncidentID: incidentID,
		AuthorID:   userID,
		Body:       body,
	})
	if err != nil {
		return models.IncidentUpdate{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return models.IncidentUpdate{}, err
	}

	return update, nil
}

func incidentReference(id uuid.UUID) string {
	return "INC-" + strings.ToUpper(id.String()[:8])
}

func validSeverity(severity string) bool {
	switch severity {
	case "low", "medium", "high", "critical":
		return true
	default:
		return false
	}
}

func mapIncidentAlertLookupError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrAlertNotFound
	}

	return err
}

func mapIncidentLookupError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrIncidentNotFound
	}

	return err
}
