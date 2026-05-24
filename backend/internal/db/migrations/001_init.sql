CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE severity AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE alert_status AS ENUM (
  'triggered',
  'acknowledged',
  'resolved',
  'escalated'
);

CREATE TYPE escalation_event_status AS ENUM (
  'pending',
  'notified',
  'acknowledged',
  'cancelled'
);

CREATE TYPE incident_status AS ENUM (
  'investigating',
  'fixing',
  'monitoring',
  'resolved'
);

CREATE TYPE notification_status AS ENUM (
  'unread',
  'read'
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  service_name TEXT NOT NULL,
  environment TEXT NOT NULL,
  severity severity NOT NULL,
  status alert_status NOT NULL DEFAULT 'triggered',
  source TEXT NOT NULL,

  summary TEXT NOT NULL,
  metric_name TEXT,
  threshold TEXT,
  current_value TEXT,
  affected_customers TEXT,

  runbook_url TEXT,
  dashboard_url TEXT,
  logs_url TEXT,

  triggered_at TIMESTAMPTZ NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,

  linked_incident_id UUID,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE escalation_events (
  id UUID PRIMARY KEY,
  alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  level INT NOT NULL,
  notify_at TIMESTAMPTZ NOT NULL,
  status escalation_event_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incidents (
  id UUID PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  service_name TEXT NOT NULL,
  severity severity NOT NULL,
  status incident_status NOT NULL DEFAULT 'investigating',
  created_from_alert_id UUID REFERENCES alerts(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE alerts
ADD CONSTRAINT alerts_linked_incident_fk
FOREIGN KEY (linked_incident_id)
REFERENCES incidents(id);

CREATE TABLE incident_updates (
  id UUID PRIMARY KEY,
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  alert_id UUID REFERENCES alerts(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status notification_status NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shifts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alerts_status_created_at ON alerts(status, created_at DESC);
CREATE INDEX idx_alerts_service_created_at ON alerts(service_name, created_at DESC);
CREATE INDEX idx_escalation_events_alert_id ON escalation_events(alert_id);
CREATE INDEX idx_incidents_status_created_at ON incidents(status, created_at DESC);
CREATE INDEX idx_incident_updates_incident_id_created_at ON incident_updates(incident_id, created_at);
CREATE INDEX idx_notification_events_user_status_created_at ON notification_events(user_id, status, created_at DESC);
CREATE INDEX idx_shifts_user_time ON shifts(user_id, starts_at, ends_at);
