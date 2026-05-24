package handlers

import (
	"errors"
	"net/http"

	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/httpjson"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/services"
)

type WebhookHandler struct {
	alertSvc *services.AlertService
}

func NewWebhookHandler(alertSvc *services.AlertService) *WebhookHandler {
	return &WebhookHandler{alertSvc: alertSvc}
}

type createAlertWebhookRequest struct {
	Title             string  `json:"title"`
	ServiceName       string  `json:"service_name"`
	Environment       string  `json:"environment"`
	Severity          string  `json:"severity"`
	Source            string  `json:"source"`
	Summary           string  `json:"summary"`
	MetricName        *string `json:"metric_name"`
	Threshold         *string `json:"threshold"`
	CurrentValue      *string `json:"current_value"`
	AffectedCustomers *string `json:"affected_customers"`
	RunbookURL        *string `json:"runbook_url"`
	DashboardURL      *string `json:"dashboard_url"`
	LogsURL           *string `json:"logs_url"`
}

func (h *WebhookHandler) ReceiveAlert(w http.ResponseWriter, r *http.Request) {
	var req createAlertWebhookRequest

	if err := httpjson.ReadJSON(r, &req); err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	alert, err := h.alertSvc.CreateFromWebhook(r.Context(), services.CreateAlertInput{
		Title:             req.Title,
		ServiceName:       req.ServiceName,
		Environment:       req.Environment,
		Severity:          req.Severity,
		Source:            req.Source,
		Summary:           req.Summary,
		MetricName:        req.MetricName,
		Threshold:         req.Threshold,
		CurrentValue:      req.CurrentValue,
		AffectedCustomers: req.AffectedCustomers,
		RunbookURL:        req.RunbookURL,
		DashboardURL:      req.DashboardURL,
		LogsURL:           req.LogsURL,
	})
	if err != nil {
		if errors.Is(err, services.ErrInvalidAlertInput) {
			httpjson.WriteError(w, http.StatusBadRequest, "invalid alert payload")
			return
		}

		httpjson.WriteError(w, http.StatusInternalServerError, "failed to create alert")
		return
	}

	httpjson.WriteJSON(w, http.StatusCreated, alert)
}
