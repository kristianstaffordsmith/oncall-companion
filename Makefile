.PHONY: dev api mobile generate-client reset-db test-alert acknowledge-alert resolve-alert escalate-alert create-incident add-incident-update generate-ai-summary

dev:
	docker compose up --build

api:
	cd backend && go run ./cmd/api

mobile:
	cd mobile && npm run start

generate-client:
	cd mobile && npm run generate:api

reset-db:
	docker compose down -v
	docker compose up --build

test-alert:
	@curl -sS -X POST http://localhost:8080/webhooks/alerts \
		-H "Content-Type: application/json" \
		-d '{"title":"Elevated API error rate","service_name":"payments-api","environment":"production","severity":"critical","source":"external-monitoring","summary":"500 errors increased from 0.2% to 12.4% over 5 minutes.","metric_name":"http.server.errors.rate","threshold":"> 5% for 5 minutes","current_value":"12.4%","affected_customers":"approx. 18%","runbook_url":"https://example.com/runbooks/payments-api","dashboard_url":"https://example.com/dashboards/payments-api","logs_url":"https://example.com/logs/payments-api"}'

acknowledge-alert:
	@curl -sS -X POST http://localhost:8080/alerts/$(ALERT_ID)/acknowledge

resolve-alert:
	@curl -sS -X POST http://localhost:8080/alerts/$(ALERT_ID)/resolve

escalate-alert:
	@curl -sS -X POST http://localhost:8080/alerts/$(ALERT_ID)/escalate

create-incident:
	@curl -sS -X POST http://localhost:8080/alerts/$(ALERT_ID)/create-incident \
		-H "Content-Type: application/json" \
		-d '{}'

add-incident-update:
	@curl -sS -X POST http://localhost:8080/incidents/$(INCIDENT_ID)/updates \
		-H "Content-Type: application/json" \
		-d '{"body":"Checking recent deploys and API error logs"}'

generate-ai-summary:
	@curl -sS -X POST http://localhost:8080/incidents/$(INCIDENT_ID)/ai-summary
