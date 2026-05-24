package handlers

import (
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/httpjson"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/repository"
)

type MeHandler struct {
	usersRepo *repository.UsersRepo
}

func NewMeHandler(usersRepo *repository.UsersRepo) *MeHandler {
	return &MeHandler{usersRepo: usersRepo}
}

func (h *MeHandler) Get(w http.ResponseWriter, r *http.Request) {
	user, err := h.usersRepo.GetCurrentUser(r.Context())
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			httpjson.WriteError(w, http.StatusNotFound, "current user not found")
			return
		}

		httpjson.WriteError(w, http.StatusInternalServerError, "failed to load current user")
		return
	}

	httpjson.WriteJSON(w, http.StatusOK, user)
}
