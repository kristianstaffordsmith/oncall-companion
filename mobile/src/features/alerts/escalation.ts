import type { components } from '@/api/generated';

import type { TimelineEntry } from '@/components/Timeline';

type Alert = components['schemas']['Alert'];
type EscalationEvent = components['schemas']['EscalationEvent'];

export function getNextPendingEscalation(
  events: EscalationEvent[],
): EscalationEvent | null {
  return (
    events
      .filter((event) => event.status === 'pending')
      .sort(
        (a, b) => new Date(a.notify_at).getTime() - new Date(b.notify_at).getTime(),
      )[0] ?? null
  );
}

export function formatCountdown(notifyAt: string, now = Date.now()): string {
  const diffMs = new Date(notifyAt).getTime() - now;

  if (diffMs <= 0) {
    return '0:00';
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function shouldShowEscalationBanner(alert: Alert, events: EscalationEvent[]): boolean {
  if (alert.status === 'resolved' || alert.status === 'acknowledged') {
    return false;
  }

  return getNextPendingEscalation(events) !== null;
}

export function buildEscalationTimelineEntries(
  alert: Alert,
  events: EscalationEvent[],
): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      id: 'triggered',
      time: alert.triggered_at,
      title: 'Alert triggered',
    },
  ];

  const sortedEvents = [...events].sort((a, b) => a.level - b.level);

  for (const event of sortedEvents) {
    if (event.status === 'notified') {
      entries.push({
        id: event.id,
        time: event.notify_at,
        title: `${event.user.name} paged`,
      });
      continue;
    }

    if (event.status === 'pending') {
      entries.push({
        id: event.id,
        time: event.notify_at,
        title: `Escalates to ${event.user.name}`,
        subtitle: 'Scheduled escalation',
        tone: 'warning',
      });
    }
  }

  if (alert.status === 'triggered' || alert.status === 'escalated') {
    entries.push({
      id: 'awaiting-ack',
      time: alert.triggered_at,
      title: 'Awaiting acknowledgement',
      tone: 'warning',
    });
  }

  if (alert.acknowledged_at) {
    entries.push({
      id: 'acknowledged',
      time: alert.acknowledged_at,
      title: 'Acknowledged',
      tone: 'success',
    });
  }

  return entries;
}
