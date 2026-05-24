package services

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/kristianstaffordsmith/oncall-companion/backend/internal/models"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type AIConfig struct {
	OpenAIKey string
}

type AIService struct {
	cfg              AIConfig
	completionClient incidentSummaryCompletionClient
}

type incidentSummaryCompletionClient interface {
	CompleteIncidentSummary(ctx context.Context, prompt string) (string, error)
}

func NewAIService(cfg AIConfig) *AIService {
	service := &AIService{cfg: cfg}
	if strings.TrimSpace(cfg.OpenAIKey) != "" {
		service.completionClient = newOpenAIIncidentSummaryClient(cfg.OpenAIKey)
	}

	return service
}

func (s *AIService) GenerateIncidentSummary(ctx context.Context, detail models.IncidentDetail) (models.IncidentAISummary, error) {
	if strings.TrimSpace(s.cfg.OpenAIKey) == "" || s.completionClient == nil {
		return s.fallbackSummary(detail), nil
	}

	rawSummary, err := s.completionClient.CompleteIncidentSummary(ctx, buildIncidentSummaryPrompt(detail))
	if err != nil {
		return s.fallbackSummary(detail), nil
	}

	var summary models.IncidentAISummary
	if err := json.Unmarshal([]byte(rawSummary), &summary); err != nil {
		return s.fallbackSummary(detail), nil
	}

	if !summary.Validate() {
		return s.fallbackSummary(detail), nil
	}

	return summary, nil
}

func (s *AIService) fallbackSummary(detail models.IncidentDetail) models.IncidentAISummary {
	incident := detail.Incident
	alert := primaryLinkedAlert(detail)

	summary := models.IncidentAISummary{
		Severity:    incident.Severity,
		Summary:     "The incident is tracking " + incident.Title + " for " + incident.ServiceName + ".",
		LikelyCause: "Likely causes include a deploy-related regression, dependency latency, database pressure, or degraded upstream service behaviour.",
		SuggestedActions: []string{
			"Check recent deploys and roll back if the timing aligns with the alert.",
			"Review service dashboards, logs, and error traces for the affected path.",
			"Post a short stakeholder update and keep the incident timeline current.",
		},
		StatusPageDraft:  "We are investigating elevated errors affecting " + incident.ServiceName + ". We will share another update after the current mitigation checks complete.",
		SlackUpdateDraft: "Investigating " + incident.Title + " for " + incident.ServiceName + ". Current focus: verify recent deploys, inspect logs, and confirm customer impact.",
		Confidence:       0.74,
	}

	if alert.Summary != "" {
		summary.Summary = "The incident appears to involve " + alert.Summary
	}

	if alert.AffectedCustomers != nil && strings.TrimSpace(*alert.AffectedCustomers) != "" {
		summary.StatusPageDraft = "We are investigating elevated errors affecting " + incident.ServiceName + " (" + strings.TrimSpace(*alert.AffectedCustomers) + "). We will share another update after the current mitigation checks complete."
	}

	if alert.RunbookURL != nil && strings.TrimSpace(*alert.RunbookURL) != "" {
		summary.SuggestedActions = append(summary.SuggestedActions, "Follow the linked runbook: "+strings.TrimSpace(*alert.RunbookURL)+".")
	}

	if len(detail.Updates) > 0 {
		lastUpdate := strings.TrimSpace(detail.Updates[len(detail.Updates)-1].Body)
		if lastUpdate != "" {
			summary.SlackUpdateDraft = "Investigating " + incident.Title + " for " + incident.ServiceName + ". Latest timeline update: " + lastUpdate
		}
	}

	if !summary.Validate() {
		return fallbackAISummary()
	}

	return summary
}

type openAIIncidentSummaryClient struct {
	client openai.Client
}

func newOpenAIIncidentSummaryClient(apiKey string) *openAIIncidentSummaryClient {
	return &openAIIncidentSummaryClient{
		client: openai.NewClient(
			option.WithAPIKey(apiKey),
			option.WithMaxRetries(1),
			option.WithRequestTimeout(8*time.Second),
		),
	}
}

func (c *openAIIncidentSummaryClient) CompleteIncidentSummary(ctx context.Context, prompt string) (string, error) {
	chat, err := c.client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model: openai.ChatModelGPT4oMini2024_07_18,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage("You are an incident response assistant. Return concise operational guidance as valid JSON only. Do not include markdown or prose outside the JSON object."),
			openai.UserMessage(prompt),
		},
		MaxCompletionTokens: openai.Int(700),
		Temperature:         openai.Float(0.2),
		ResponseFormat: openai.ChatCompletionNewParamsResponseFormatUnion{
			OfJSONSchema: &openai.ResponseFormatJSONSchemaParam{
				JSONSchema: incidentAISummaryResponseSchema(),
			},
		},
	})
	if err != nil {
		return "", err
	}

	if len(chat.Choices) == 0 {
		return "", errors.New("openai returned no choices")
	}

	content := strings.TrimSpace(chat.Choices[0].Message.Content)
	if content == "" {
		return "", errors.New("openai returned empty summary")
	}

	return content, nil
}

func buildIncidentSummaryPrompt(detail models.IncidentDetail) string {
	contextJSON, err := json.MarshalIndent(incidentContextForAI(detail), "", "  ")
	if err != nil {
		contextJSON = []byte("{}")
	}

	return "Generate an IncidentAISummary JSON object for this incident context. " +
		"Use the incident severity unless the context clearly supports a lower severity. " +
		"Keep suggested_actions practical and ordered by urgency.\n\n" +
		string(contextJSON)
}

func incidentContextForAI(detail models.IncidentDetail) map[string]any {
	incident := detail.Incident
	context := map[string]any{
		"incident": map[string]any{
			"reference":    incident.Reference,
			"title":        incident.Title,
			"service_name": incident.ServiceName,
			"severity":     incident.Severity,
			"status":       incident.Status,
		},
	}

	alerts := make([]map[string]any, 0, len(detail.LinkedAlerts))
	for _, alert := range detail.LinkedAlerts {
		alerts = append(alerts, map[string]any{
			"title":              alert.Title,
			"service_name":       alert.ServiceName,
			"environment":        alert.Environment,
			"severity":           alert.Severity,
			"status":             alert.Status,
			"source":             alert.Source,
			"summary":            alert.Summary,
			"metric_name":        alert.MetricName,
			"threshold":          alert.Threshold,
			"current_value":      alert.CurrentValue,
			"affected_customers": alert.AffectedCustomers,
			"runbook_url":        alert.RunbookURL,
			"dashboard_url":      alert.DashboardURL,
			"logs_url":           alert.LogsURL,
		})
	}
	context["linked_alerts"] = alerts

	updates := make([]string, 0, len(detail.Updates))
	for _, update := range detail.Updates {
		body := strings.TrimSpace(update.Body)
		if body != "" {
			updates = append(updates, body)
		}
	}
	context["timeline_updates"] = updates

	return context
}

func incidentAISummaryResponseSchema() openai.ResponseFormatJSONSchemaJSONSchemaParam {
	return openai.ResponseFormatJSONSchemaJSONSchemaParam{
		Name:        "incident_ai_summary",
		Description: openai.String("Structured incident response summary for OnCall Companion"),
		Strict:      openai.Bool(true),
		Schema: map[string]any{
			"type":                 "object",
			"additionalProperties": false,
			"required": []string{
				"severity",
				"summary",
				"likely_cause",
				"suggested_actions",
				"status_page_draft",
				"slack_update_draft",
				"confidence",
			},
			"properties": map[string]any{
				"severity": map[string]any{
					"type": "string",
					"enum": []string{"low", "medium", "high", "critical"},
				},
				"summary": map[string]any{
					"type": "string",
				},
				"likely_cause": map[string]any{
					"type": "string",
				},
				"suggested_actions": map[string]any{
					"type": "array",
					"items": map[string]any{
						"type": "string",
					},
				},
				"status_page_draft": map[string]any{
					"type": "string",
				},
				"slack_update_draft": map[string]any{
					"type": "string",
				},
				"confidence": map[string]any{
					"type":    "number",
					"minimum": 0,
					"maximum": 1,
				},
			},
		},
	}
}

func primaryLinkedAlert(detail models.IncidentDetail) models.Alert {
	if len(detail.LinkedAlerts) == 0 {
		return models.Alert{}
	}

	return detail.LinkedAlerts[0]
}

func fallbackAISummary() models.IncidentAISummary {
	return models.IncidentAISummary{
		Severity:    "medium",
		Summary:     "Unable to generate a complete summary from the available incident context.",
		LikelyCause: "There is not enough context to identify a likely cause yet.",
		SuggestedActions: []string{
			"Add a timeline update with the latest investigation findings.",
			"Review dashboards, logs, and recent deploy activity.",
		},
		StatusPageDraft:  "We are investigating an active production issue and will provide another update soon.",
		SlackUpdateDraft: "Investigating the incident. More context is needed before recommending a specific mitigation.",
		Confidence:       0.4,
	}
}
