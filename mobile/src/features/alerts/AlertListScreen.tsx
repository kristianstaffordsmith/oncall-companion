import { View } from 'react-native';
import { router } from 'expo-router';

import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAlerts } from '@/features/alerts/hooks';
import {
  isActiveAlert,
  sortAlertsNewestFirst,
} from '@/features/home/selectors';
import { spacing } from '@/theme/spacing';
import { formatRelativeTime } from '@/utils/date';
import { formatAlertMetadata } from '@/utils/format';

export function AlertListScreen() {
  const alertsQuery = useAlerts();
  const activeAlerts = sortAlertsNewestFirst(
    alertsQuery.data?.filter(isActiveAlert) ?? [],
  );

  return (
    <Screen>
      <ScreenHeader title="Alerts" />
      {alertsQuery.isLoading ? (
        <LoadingState message="Loading alerts…" />
      ) : alertsQuery.isError ? (
        <ErrorState message="Couldn't load alerts." onRetry={() => alertsQuery.refetch()} />
      ) : activeAlerts.length === 0 ? (
        <EmptyState title="No active alerts" message="Monitoring is quiet right now." />
      ) : (
        <View style={{ gap: spacing.listGap }}>
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              metadata={formatAlertMetadata(
                alert.service_name,
                alert.environment,
                undefined,
                formatRelativeTime(alert.triggered_at),
              )}
              severity={alert.severity}
              status={alert.status}
              onPress={() => router.push(`/alerts/${alert.id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
