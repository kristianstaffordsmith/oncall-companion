package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

type EscalationService struct {
	alertsRepo *repository.AlertsRepo
}

func NewEscalationService(alertsRepo *repository.AlertsRepo) *EscalationService {
	return &EscalationService{alertsRepo: alertsRepo}
}

func (s *EscalationService) CreateForAlert(ctx context.Context, q repository.Queryer, alert models.Alert) error {
	primaryUserID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return err
	}

	secondaryUserID, err := uuid.Parse(repository.SecondaryUserID)
	if err != nil {
		return err
	}

	managerUserID, err := uuid.Parse(repository.ManagerUserID)
	if err != nil {
		return err
	}

	events := []struct {
		userID   uuid.UUID
		level    int
		notifyAt time.Time
		status   string
	}{
		{
			userID:   primaryUserID,
			level:    1,
			notifyAt: alert.TriggeredAt,
			status:   "notified",
		},
		{
			userID:   secondaryUserID,
			level:    2,
			notifyAt: alert.TriggeredAt.Add(5 * time.Minute),
			status:   "pending",
		},
		{
			userID:   managerUserID,
			level:    3,
			notifyAt: alert.TriggeredAt.Add(15 * time.Minute),
			status:   "pending",
		},
	}

	for _, event := range events {
		err := s.alertsRepo.CreateEscalationEvent(ctx, q, models.EscalationEvent{
			ID:       uuid.New(),
			AlertID:  alert.ID,
			Level:    event.level,
			NotifyAt: event.notifyAt,
			Status:   event.status,
		}, event.userID)
		if err != nil {
			return err
		}
	}

	return nil
}
