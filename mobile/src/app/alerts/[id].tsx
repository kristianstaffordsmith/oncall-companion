import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function AlertDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const alertId = Array.isArray(id) ? id[0] : id;

  return (
    <Screen>
      <ScreenHeader title="Alert detail" />
      <SectionCard>
        <AppText variant="eyebrow">Alert</AppText>
        <AppText variant="title">Alert detail</AppText>
        <AppText style={{ color: colors.textSecondary }}>
          Placeholder route for alert {alertId ?? 'unknown'}. The full triage flow is implemented
          in a later phase.
        </AppText>
      </SectionCard>
    </Screen>
  );
}
