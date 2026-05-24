package services

import (
	"context"
	"errors"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
)

func TestAIServiceGenerateIncidentSummaryUsesDeterministicFallbackWithoutKey(t *testing.T) {
	service := NewAIService(AIConfig{})
	runbookURL := "https://example.com/runbooks/payments-api"
	affectedCustomers := "approx. 18%"

	summary, err := service.GenerateIncidentSummary(context.Background(), models.IncidentDetail{
		Incident: models.Incident{
			ID:          uuid.New(),
			Title:       "Elevated API error rate",
			ServiceName: "payments-api",
			Severity:    "critical",
			Status:      "investigating",
		},
		LinkedAlerts: []models.Alert{
			{
				ID:                uuid.New(),
				Summary:           "500 errors increased from 0.2% to 12.4% over 5 minutes.",
				AffectedCustomers: &affectedCustomers,
				RunbookURL:        &runbookURL,
			},
		},
		Updates: []models.IncidentUpdate{
			{Body: "Checking recent deploys and API error logs"},
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !summary.Validate() {
		t.Fatal("expected generated summary to validate")
	}

	if summary.Severity != "critical" {
		t.Fatalf("expected incident severity, got %q", summary.Severity)
	}

	if summary.Confidence != 0.74 {
		t.Fatalf("expected deterministic confidence, got %v", summary.Confidence)
	}
}

func TestAIServiceGenerateIncidentSummaryUsesOpenAIClientWhenKeyIsConfigured(t *testing.T) {
	fakeClient := &fakeIncidentSummaryCompletionClient{
		response: `{
			"severity": "critical",
			"summary": "The payments API is returning elevated errors.",
			"likely_cause": "A recent deploy likely introduced a regression.",
			"suggested_actions": ["Check deploy history.", "Review error traces."],
			"status_page_draft": "We are investigating elevated payments API errors.",
			"slack_update_draft": "Investigating elevated payments API errors; checking recent deploys.",
			"confidence": 0.82
		}`,
	}
	service := &AIService{
		cfg:              AIConfig{OpenAIKey: "test-key"},
		completionClient: fakeClient,
	}

	summary, err := service.GenerateIncidentSummary(context.Background(), models.IncidentDetail{
		Incident: models.Incident{
			Title:       "Elevated API error rate",
			ServiceName: "payments-api",
			Severity:    "critical",
			Status:      "investigating",
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !fakeClient.called {
		t.Fatal("expected OpenAI client to be called")
	}

	if !strings.Contains(fakeClient.prompt, "payments-api") {
		t.Fatalf("expected prompt to include incident context, got %q", fakeClient.prompt)
	}

	if summary.Confidence != 0.82 {
		t.Fatalf("expected provider confidence, got %v", summary.Confidence)
	}
}

func TestAIServiceGenerateIncidentSummaryFallsBackWhenOpenAIClientErrors(t *testing.T) {
	service := &AIService{
		cfg: AIConfig{OpenAIKey: "test-key"},
		completionClient: &fakeIncidentSummaryCompletionClient{
			err: errors.New("provider unavailable"),
		},
	}

	summary, err := service.GenerateIncidentSummary(context.Background(), models.IncidentDetail{
		Incident: models.Incident{
			Title:       "Elevated API error rate",
			ServiceName: "payments-api",
			Severity:    "critical",
			Status:      "investigating",
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if summary.Confidence != 0.74 {
		t.Fatalf("expected deterministic fallback confidence, got %v", summary.Confidence)
	}
}

func TestAIServiceGenerateIncidentSummaryFallsBackWhenOpenAIOutputIsInvalid(t *testing.T) {
	service := &AIService{
		cfg: AIConfig{OpenAIKey: "test-key"},
		completionClient: &fakeIncidentSummaryCompletionClient{
			response: `{"severity":"unknown"}`,
		},
	}

	summary, err := service.GenerateIncidentSummary(context.Background(), models.IncidentDetail{
		Incident: models.Incident{
			Title:       "Elevated API error rate",
			ServiceName: "payments-api",
			Severity:    "critical",
			Status:      "investigating",
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if summary.Confidence != 0.74 {
		t.Fatalf("expected deterministic fallback confidence, got %v", summary.Confidence)
	}
}

func TestAIServiceGenerateIncidentSummaryFallsBackWhenContextIsInvalid(t *testing.T) {
	service := NewAIService(AIConfig{})

	summary, err := service.GenerateIncidentSummary(context.Background(), models.IncidentDetail{
		Incident: models.Incident{
			Severity: "unknown",
		},
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if !summary.Validate() {
		t.Fatal("expected fallback summary to validate")
	}

	if summary.Severity != "medium" {
		t.Fatalf("expected conservative fallback severity, got %q", summary.Severity)
	}
}

type fakeIncidentSummaryCompletionClient struct {
	response string
	err      error
	called   bool
	prompt   string
}

func (c *fakeIncidentSummaryCompletionClient) CompleteIncidentSummary(ctx context.Context, prompt string) (string, error) {
	_ = ctx
	c.called = true
	c.prompt = prompt

	if c.err != nil {
		return "", c.err
	}

	return c.response, nil
}
