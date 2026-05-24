package services

import (
	"context"

	"github.com/google/uuid"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

type ScheduleService struct {
	scheduleRepo *repository.ScheduleRepo
}

func NewScheduleService(scheduleRepo *repository.ScheduleRepo) *ScheduleService {
	return &ScheduleService{scheduleRepo: scheduleRepo}
}

func (s *ScheduleService) Current(ctx context.Context) (models.Shift, error) {
	userID, err := uuid.Parse(repository.DemoUserID)
	if err != nil {
		return models.Shift{}, err
	}

	return s.scheduleRepo.GetCurrentShift(ctx, userID)
}
