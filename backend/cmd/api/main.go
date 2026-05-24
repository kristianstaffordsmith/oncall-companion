package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/app"
)

func main() {
	ctx := context.Background()

	application, err := app.New(ctx)
	if err != nil {
		log.Fatalf("failed to initialise app: %v", err)
	}

	server := &http.Server{
		Addr:         ":" + application.Config.Port,
		Handler:      application.Router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Printf("api listening on :%s", application.Config.Port)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server failed: %v", err)
	}
}
