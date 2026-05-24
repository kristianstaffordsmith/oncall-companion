import { SectionCard } from '@/components/SectionCard';
import { Timeline } from '@/components/Timeline';
import type { components } from '@/api/generated';
import { buildEscalationTimelineEntries } from '@/features/alerts/escalation';

type Alert = components['schemas']['Alert'];
type EscalationEvent = components['schemas']['EscalationEvent'];

type Props = {
  alert: Alert;
  events: EscalationEvent[];
};

export function EscalationTimeline({ alert, events }: Props) {
  const items = buildEscalationTimelineEntries(alert, events);

  return (
    <SectionCard title="Timeline">
      <Timeline items={items} />
    </SectionCard>
  );
}
