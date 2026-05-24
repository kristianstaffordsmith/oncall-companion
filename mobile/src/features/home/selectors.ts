import type { components } from '@/api/generated';

type Alert = components['schemas']['Alert'];
type Incident = components['schemas']['Incident'];

export function isActiveAlert(alert: Alert): boolean {
  return alert.status !== 'resolved';
}

export function isActiveIncident(incident: Incident): boolean {
  return incident.status !== 'resolved';
}

export function sortAlertsNewestFirst(alerts: Alert[]): Alert[] {
  return [...alerts].sort(
    (a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime(),
  );
}

export function sortIncidentsNewestFirst(incidents: Incident[]): Incident[] {
  return [...incidents].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function previewItems<T>(items: T[], limit = 2): T[] {
  return items.slice(0, limit);
}

export function seeAllLabel(count: number): string {
  return count > 2 ? `See all (${count})` : 'See all';
}
