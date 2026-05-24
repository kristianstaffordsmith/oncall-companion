import { View } from 'react-native';
import { router } from 'expo-router';

import { AlertCard } from '@/components/AlertCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { SectionHeader } from '@/components/SectionHeader';
import { useAlerts } from '@/features/alerts/hooks';
import {
  isActiveAlert,
  sortAlertsNewestFirst,
  toAlertCardProps,
} from '@/features/alerts/selectors';
import { spacing } from '@/theme/spacing';
import { seeAllLabel } from '@/utils/format';

type Props = {
  limit?: number;
  showHeader?: boolean;
  onSeeAllPress?: () => void;
};

export function ActiveAlertsSection({ limit, showHeader = false, onSeeAllPress }: Props) {
  const alertsQuery = useAlerts();
  const activeAlerts = sortAlertsNewestFirst(
    alertsQuery.data?.filter(isActiveAlert) ?? [],
  );
  const visibleAlerts = limit ? activeAlerts.slice(0, limit) : activeAlerts;

  return (
    <View style={{ gap: spacing.listGap }}>
      {showHeader ? (
        <SectionHeader
          title="Active alerts"
          actionLabel={activeAlerts.length > 0 ? seeAllLabel(activeAlerts.length) : undefined}
          onActionPress={activeAlerts.length > 0 ? onSeeAllPress : undefined}
        />
      ) : null}

      {alertsQuery.isLoading ? (
        <LoadingState message="Loading alerts…" />
      ) : alertsQuery.isError ? (
        <ErrorState message="Couldn't load alerts." onRetry={() => alertsQuery.refetch()} />
      ) : visibleAlerts.length === 0 ? (
        <EmptyState title="No active alerts" message="Monitoring is quiet right now." />
      ) : (
        visibleAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            {...toAlertCardProps(alert)}
            onPress={() => router.push(`/alerts/${alert.id}`)}
          />
        ))
      )}
    </View>
  );
}
