package handlers

import (
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/httpjson"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/services"
)

type ScheduleHandler struct {
	scheduleSvc *services.ScheduleService
}

func NewScheduleHandler(scheduleSvc *services.ScheduleService) *ScheduleHandler {
	return &ScheduleHandler{scheduleSvc: scheduleSvc}
}

func (h *ScheduleHandler) Current(w http.ResponseWriter, r *http.Request) {
	shift, err := h.scheduleSvc.Current(r.Context())
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpjson.WriteError(w, http.StatusNotFound, "current shift not found")
			return
		}

		httpjson.WriteError(w, http.StatusInternalServerError, "failed to load current shift")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, shift)
}
