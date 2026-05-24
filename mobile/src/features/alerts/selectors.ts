import type { components } from '@/api/generated';

import { formatRelativeTime } from '@/utils/date';
import { formatAlertMetadata } from '@/utils/format';

type Alert = components['schemas']['Alert'];

export function isActiveAlert(alert: Alert): boolean {
  return alert.status !== 'resolved';
}

export function sortAlertsNewestFirst(alerts: Alert[]): Alert[] {
  return [...alerts].sort(
    (a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime(),
  );
}

export function toAlertCardProps(alert: Alert) {
  return {
    title: alert.title,
    metadata: formatAlertMetadata(
      alert.service_name,
      alert.environment,
      formatRelativeTime(alert.triggered_at),
    ),
    severity: alert.severity,
    status: alert.status,
  };
}
