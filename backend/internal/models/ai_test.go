package models

import "testing"

func TestIncidentAISummaryValidate(t *testing.T) {
	summary := IncidentAISummary{
		Severity:         "critical",
		Summary:          "Payments API is returning elevated production errors.",
		LikelyCause:      "A deploy-related regression or upstream dependency issue is likely.",
		SuggestedActions: []string{"Check recent deploys."},
		StatusPageDraft:  "We are investigating elevated errors.",
		SlackUpdateDraft: "Investigating elevated errors in payments-api.",
		Confidence:       0.74,
	}

	if !summary.Validate() {
		t.Fatal("expected valid summary")
	}
}

func TestIncidentAISummaryValidateRejectsIncompleteOutput(t *testing.T) {
	summary := IncidentAISummary{
		Severity:         "unknown",
		Summary:          "Payments API is returning elevated production errors.",
		LikelyCause:      "A deploy-related regression or upstream dependency issue is likely.",
		SuggestedActions: []string{"Check recent deploys."},
		StatusPageDraft:  "We are investigating elevated errors.",
		SlackUpdateDraft: "Investigating elevated errors in payments-api.",
		Confidence:       0.74,
	}

	if summary.Validate() {
		t.Fatal("expected invalid summary")
	}
}
