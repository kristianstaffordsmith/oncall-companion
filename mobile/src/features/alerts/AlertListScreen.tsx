import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ActiveAlertsSection } from '@/features/alerts/ActiveAlertsSection';

export function AlertListScreen() {
  return (
    <Screen>
      <ScreenHeader title="Alerts" />
      <ActiveAlertsSection />
    </Screen>
  );
}
