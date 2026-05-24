package handlers

import (
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/httpjson"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/services"
)

type IncidentsHandler struct {
	incidentSvc *services.IncidentService
}

func NewIncidentsHandler(incidentSvc *services.IncidentService) *IncidentsHandler {
	return &IncidentsHandler{incidentSvc: incidentSvc}
}

type createIncidentFromAlertRequest struct {
	Title    *string `json:"title"`
	Severity *string `json:"severity"`
}

type addIncidentUpdateRequest struct {
	Body string `json:"body"`
}

func (h *IncidentsHandler) List(w http.ResponseWriter, r *http.Request) {
	incidents, err := h.incidentSvc.List(r.Context())
	if err != nil {
		httpjson.WriteError(w, http.StatusInternalServerError, "failed to list incidents")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, incidents)
}

func (h *IncidentsHandler) Get(w http.ResponseWriter, r *http.Request) {
	id, err := incidentIDParam(r)
	if err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid incident id")
		return
	}

	incidentDetail, err := h.incidentSvc.GetDetail(r.Context(), id)
	if err != nil {
		writeIncidentError(w, err, "failed to load incident")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, incidentDetail)
}

func (h *IncidentsHandler) CreateFromAlert(w http.ResponseWriter, r *http.Request) {
	alertID, err := alertIDParam(r)
	if err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid alert id")
		return
	}

	var req createIncidentFromAlertRequest
	if r.Body != nil && r.ContentLength != 0 {
		if err := httpjson.ReadJSON(r, &req); err != nil {
			httpjson.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
	}

	incidentDetail, err := h.incidentSvc.CreateFromAlert(r.Context(), alertID, services.CreateIncidentFromAlertInput{
		Title:    req.Title,
		Severity: req.Severity,
	})
	if err != nil {
		writeIncidentError(w, err, "failed to create incident")
		return
	}

	httpjson.WriteJSON(w, http.StatusCreated, incidentDetail)
}

func (h *IncidentsHandler) AddUpdate(w http.ResponseWriter, r *http.Request) {
	incidentID, err := incidentIDParam(r)
	if err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid incident id")
		return
	}

	var req addIncidentUpdateRequest
	if err := httpjson.ReadJSON(r, &req); err != nil {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	update, err := h.incidentSvc.AddUpdate(r.Context(), incidentID, services.AddIncidentUpdateInput{
		Body: req.Body,
	})
	if err != nil {
		writeIncidentError(w, err, "failed to add incident update")
		return
	}

	httpjson.WriteJSON(w, http.StatusCreated, update)
}

func incidentIDParam(r *http.Request) (uuid.UUID, error) {
	return uuid.Parse(chi.URLParam(r, "id"))
}

func writeIncidentError(w http.ResponseWriter, err error, fallback string) {
	if errors.Is(err, services.ErrAlertNotFound) {
		httpjson.WriteError(w, http.StatusNotFound, "alert not found")
		return
	}

	if errors.Is(err, services.ErrIncidentNotFound) {
		httpjson.WriteError(w, http.StatusNotFound, "incident not found")
		return
	}

	if errors.Is(err, services.ErrIncidentAlreadyExists) {
		httpjson.WriteError(w, http.StatusConflict, "incident already exists for alert")
		return
	}

	if errors.Is(err, services.ErrInvalidIncidentInput) {
		httpjson.WriteError(w, http.StatusBadRequest, "invalid incident input")
		return
	}

	httpjson.WriteError(w, http.StatusInternalServerError, fallback)
}
