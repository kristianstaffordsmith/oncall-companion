import { View } from 'react-native';
import { router } from 'expo-router';

import { BrandHeader } from '@/components/BrandHeader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { ActiveAlertsSection } from '@/features/alerts/ActiveAlertsSection';
import { CurrentShiftCard } from '@/features/home/CurrentShiftCard';
import { TriggerTestAlertButton } from '@/features/home/TriggerTestAlertButton';
import { ActiveIncidentsSection } from '@/features/incidents/ActiveIncidentsSection';
import { useCurrentSchedule } from '@/features/schedule/hooks';
import { spacing } from '@/theme/spacing';

export function HomeScreen() {
  const scheduleQuery = useCurrentSchedule();

  return (
    <Screen>
      <BrandHeader />

      <View style={{ gap: spacing.md }}>
        {scheduleQuery.isLoading ? (
          <LoadingState message="Loading shift…" />
        ) : scheduleQuery.isError ? (
          <ErrorState
            message="Couldn't load your current shift."
            onRetry={() => scheduleQuery.refetch()}
          />
        ) : scheduleQuery.data ? (
          <CurrentShiftCard shift={scheduleQuery.data} />
        ) : (
          <EmptyState title="No active shift" message="You're not currently on call." />
        )}
      </View>

      <ActiveAlertsSection
        limit={2}
        showHeader
        onSeeAllPress={() => router.push('/alerts')}
      />

      <ActiveIncidentsSection
        limit={2}
        showHeader
        onSeeAllPress={() => router.push('/incidents')}
      />

      <TriggerTestAlertButton />
    </Screen>
  );
}
