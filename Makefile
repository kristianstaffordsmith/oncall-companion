.PHONY: dev api mobile generate-client reset-db test-alert

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
	curl -X POST http://localhost:8080/webhooks/alerts \
		-H "Content-Type: application/json" \
		-d '{"title":"Elevated API error rate","service_name":"payments-api","environment":"production","severity":"critical","source":"external-monitoring","summary":"500 errors increased from 0.2% to 12.4% over 5 minutes.","metric_name":"http.server.errors.rate","threshold":"> 5% for 5 minutes","current_value":"12.4%","affected_customers":"approx. 18%","runbook_url":"https://example.com/runbooks/payments-api","dashboard_url":"https://example.com/dashboards/payments-api","logs_url":"https://example.com/logs/payments-api"}'
