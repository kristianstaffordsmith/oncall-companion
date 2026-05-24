import { SectionCard } from '@/components/SectionCard';
import { Timeline } from '@/components/Timeline';
import type { components } from '@/api/generated';
import { buildIncidentTimelineEntries } from '@/features/incidents/timeline';

type Incident = components['schemas']['Incident'];
type Alert = components['schemas']['Alert'];
type IncidentUpdate = components['schemas']['IncidentUpdate'];

type Props = {
  incident: Incident;
  linkedAlerts: Alert[];
  updates: IncidentUpdate[];
};

export function IncidentTimeline({ incident, linkedAlerts, updates }: Props) {
  const items = buildIncidentTimelineEntries(incident, linkedAlerts, updates);

  return (
    <SectionCard title="Timeline">
      <Timeline items={items} />
    </SectionCard>
  );
}
