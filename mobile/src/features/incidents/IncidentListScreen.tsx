import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ActiveIncidentsSection } from '@/features/incidents/ActiveIncidentsSection';

export function IncidentListScreen() {
  return (
    <Screen>
      <ScreenHeader title="Incidents" />
      <ActiveIncidentsSection />
    </Screen>
  );
}
