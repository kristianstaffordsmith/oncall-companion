import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function IncidentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const incidentId = Array.isArray(id) ? id[0] : id;

  return (
    <Screen>
      <SectionCard>
        <AppText variant="eyebrow">Incident</AppText>
        <AppText variant="title">Incident detail</AppText>
        <AppText style={{ color: colors.textSecondary }}>
          Placeholder route for incident {incidentId ?? 'unknown'}. Timeline updates and AI
          summaries are implemented in later phases.
        </AppText>
      </SectionCard>
    </Screen>
  );
}
