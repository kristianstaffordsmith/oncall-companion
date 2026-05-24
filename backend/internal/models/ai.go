package models

import "strings"

type IncidentAISummary struct {
	Severity         string   `json:"severity"`
	Summary          string   `json:"summary"`
	LikelyCause      string   `json:"likely_cause"`
	SuggestedActions []string `json:"suggested_actions"`
	StatusPageDraft  string   `json:"status_page_draft"`
	SlackUpdateDraft string   `json:"slack_update_draft"`
	Confidence       float64  `json:"confidence"`
}

func (s IncidentAISummary) Validate() bool {
	if !validSummarySeverity(s.Severity) {
		return false
	}

	if strings.TrimSpace(s.Summary) == "" ||
		strings.TrimSpace(s.LikelyCause) == "" ||
		strings.TrimSpace(s.StatusPageDraft) == "" ||
		strings.TrimSpace(s.SlackUpdateDraft) == "" {
		return false
	}

	if len(s.SuggestedActions) == 0 {
		return false
	}

	for _, action := range s.SuggestedActions {
		if strings.TrimSpace(action) == "" {
			return false
		}
	}

	return s.Confidence >= 0 && s.Confidence <= 1
}

func validSummarySeverity(severity string) bool {
	switch severity {
	case "low", "medium", "high", "critical":
		return true
	default:
		return false
	}
}
