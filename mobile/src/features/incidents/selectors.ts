import type { components } from '@/api/generated';

import { formatIncidentMetadata } from '@/utils/format';

type Incident = components['schemas']['Incident'];

export function isActiveIncident(incident: Incident): boolean {
  return incident.status !== 'resolved';
}

export function sortIncidentsNewestFirst(incidents: Incident[]): Incident[] {
  return [...incidents].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function toIncidentCardProps(incident: Incident) {
  return {
    title: incident.title,
    metadata: formatIncidentMetadata(incident.reference, incident.service_name),
    severity: incident.severity,
    status: incident.status,
  };
}
