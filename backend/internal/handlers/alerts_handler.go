package handlers

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/httpjson"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/services"
)

type AlertsHandler struct {
	alertSvc *services.AlertService
}

func NewAlertsHandler(alertSvc *services.AlertService) *AlertsHandler {
	return &AlertsHandler{alertSvc: alertSvc}
}

func (h *AlertsHandler) List(w http.ResponseWriter, r *http.Request) {
	alerts, err := h.alertSvc.List(r.Context())
	if err != nil {
		httpjson.WriteError(w, http.StatusInternalServerError, "failed to list alerts")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, alerts)
}

func (h *AlertsHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid alert id")
		return
	}

	alertDetail, err := h.alertSvc.GetDetail(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpjson.WriteError(w, http.StatusNotFound, "alert not found")
			return
		}

		httpjson.WriteError(w, http.StatusInternalServerError, "failed to load alert")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, alertDetail)
}
