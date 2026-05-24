import type { components } from '@/api/generated';

import type { TimelineEntry } from '@/components/Timeline';
import { getDemoUserName } from '@/constants/demoUsers';

type Alert = components['schemas']['Alert'];
type Incident = components['schemas']['Incident'];
type IncidentUpdate = components['schemas']['IncidentUpdate'];

const SYSTEM_UPDATE_PREFIX = 'Incident created from alert:';

export function isSystemIncidentCreatedUpdate(body: string): boolean {
  return body.startsWith(SYSTEM_UPDATE_PREFIX);
}

export function formatUpdateEntryTitle(authorId: string, body: string): string {
  if (isSystemIncidentCreatedUpdate(body)) {
    return 'Incident created';
  }

  return `${getDemoUserName(authorId)}: ${body}`;
}

export function buildIncidentTimelineEntries(
  incident: Incident,
  linkedAlerts: Alert[],
  updates: IncidentUpdate[],
): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const alert of linkedAlerts) {
    entries.push({
      id: `alert-triggered-${alert.id}`,
      time: alert.triggered_at,
      title: 'Alert triggered',
      subtitle: alert.title,
    });

    if (alert.acknowledged_at) {
      entries.push({
        id: `alert-acknowledged-${alert.id}`,
        time: alert.acknowledged_at,
        title: 'Acknowledged',
        tone: 'success',
      });
    }
  }

  entries.push({
    id: 'incident-created',
    time: incident.created_at,
    title: 'Incident created',
    tone: 'success',
  });

  for (const update of updates) {
    if (isSystemIncidentCreatedUpdate(update.body)) {
      continue;
    }

    entries.push({
      id: update.id,
      time: update.created_at,
      title: formatUpdateEntryTitle(update.author_id, update.body),
    });
  }

  return entries.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  );
}
