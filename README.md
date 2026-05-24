# oncall-companion

OnCall Companion is a small full-stack mobile demo for responding to production alerts from a phone.

The demo models a realistic on-call flow: an external monitoring system sends an alert webhook, the current on-call engineer receives a simulated page, acknowledges the alert, creates an incident, and uses a structured AI summary to communicate next steps.

I built it to explore mobile UX for high-pressure engineering workflows: making the first action obvious, keeping context concise, and using AI as an assistive layer rather than a generic chatbot.

## Demo flow

```txt
Webhook
→ simulated page
→ acknowledge alert
→ create incident
→ incident timeline
→ AI summary
```

## Stack

- Expo, React Native, TypeScript, and Expo Router for the mobile app
- TanStack Query for server state
- OpenAPI, `openapi-typescript`, and `openapi-fetch` for typed API contracts
- Go, chi, and pgxpool for the backend API
- Postgres for persistence
- Docker Compose for local infrastructure

## Running locally

The repo is being built in phases. The backend health, current user, and current schedule endpoints are the first runnable slice.

Run the API with Docker Compose:

```bash
docker compose up --build
```

Check the endpoints:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/me
curl http://localhost:8080/schedule/current
```

Trigger a demo alert and inspect it:

```bash
make test-alert
curl http://localhost:8080/alerts
```

Act on an alert by passing the returned alert ID:

```bash
make acknowledge-alert ALERT_ID=<alert-id>
make resolve-alert ALERT_ID=<alert-id>
make escalate-alert ALERT_ID=<alert-id>
```

Create an incident from an alert and add a timeline update:

```bash
make create-incident ALERT_ID=<alert-id>
curl http://localhost:8080/incidents
make add-incident-update INCIDENT_ID=<incident-id>
curl http://localhost:8080/incidents/<incident-id>
```

Generate a structured incident summary:

```bash
make generate-ai-summary INCIDENT_ID=<incident-id>
```

The AI summary endpoint returns deterministic fallback output when no API key is configured, so the demo works locally without provider setup.

To use OpenAI for the structured summary, add `OPENAI_API_KEY=...` to a local `.env` file in this directory before starting Docker Compose. If the provider call fails or returns invalid output, the backend falls back to deterministic output.

To reset the local database and rerun migrations:

```bash
docker compose down -v
docker compose up --build
```

You can also run the API locally if Postgres is already running:

```bash
cd backend
DATABASE_URL="postgres://oncall:oncall@localhost:5438/oncall_companion?sslmode=disable" go run ./cmd/api
```

Planned commands such as `make mobile` and `make generate-client` become active in later phases.

## Product tradeoffs

- Push notifications are intentionally simulated with local notification events and an in-app toast so the project stays easy to run without APNs, Expo push tokens, or device-specific setup.
- Authentication is intentionally omitted at first. The backend will use a fixed demo user so the project stays focused on the incident response workflow.
- The AI summary is structured rather than conversational. It returns validated incident context, suggested actions, and draft communications. If no API key is configured, the backend returns deterministic fallback output.

## Architecture

```mermaid
flowchart TD
    A[External monitoring tool] -->|POST /webhooks/alerts| B[Go API]
    B --> C[(Postgres)]
    B --> D[Create alert]
    B --> E[Create escalation events]
    B --> F[Create notification event]
    G[Expo mobile app] -->|Poll /notifications| B
    F --> H[In-app toast: You've been paged]
    H --> I[Alert detail]
    I -->|Acknowledge| B
    I -->|Create incident| B
    B --> J[Incident detail]
    J -->|Generate summary| K[AI summary service]
    K --> L[Structured incident summary]
```

## Disclaimer

This is an independent product-engineering demo inspired by incident response and on-call workflows. It is not affiliated with, endorsed by, or connected to incident.io.
