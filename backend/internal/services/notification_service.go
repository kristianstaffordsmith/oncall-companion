package services

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

type NotificationService struct {
	notificationsRepo *repository.NotificationsRepo
}

func NewNotificationService(notificationsRepo *repository.NotificationsRepo) *NotificationService {
	return &NotificationService{notificationsRepo: notificationsRepo}
}

func (s *NotificationService) CreateAlertNotification(
	ctx context.Context,
	q repository.Queryer,
	userID uuid.UUID,
	alert models.Alert,
) error {
	_, err := s.notificationsRepo.Create(ctx, q, models.NotificationEvent{
		ID:      uuid.New(),
		UserID:  userID,
		AlertID: &alert.ID,
		Title:   "You've been paged",
		Body:    fmt.Sprintf("%s alert for %s: %s", alert.Severity, alert.ServiceName, alert.Title),
		Status:  "unread",
	})

	return err
}
