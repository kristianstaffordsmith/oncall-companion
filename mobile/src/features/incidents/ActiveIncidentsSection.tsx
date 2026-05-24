import { View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IncidentCard } from '@/components/IncidentCard';
import { LoadingState } from '@/components/LoadingState';
import { SectionHeader } from '@/components/SectionHeader';
import { useIncidents } from '@/features/incidents/hooks';
import {
  isActiveIncident,
  sortIncidentsNewestFirst,
  toIncidentCardProps,
} from '@/features/incidents/selectors';
import { spacing } from '@/theme/spacing';
import { seeAllLabel } from '@/utils/format';

type Props = {
  limit?: number;
  showHeader?: boolean;
  onSeeAllPress?: () => void;
};

export function ActiveIncidentsSection({ limit, showHeader = false, onSeeAllPress }: Props) {
  const incidentsQuery = useIncidents();
  const activeIncidents = sortIncidentsNewestFirst(
    incidentsQuery.data?.filter(isActiveIncident) ?? [],
  );
  const visibleIncidents = limit ? activeIncidents.slice(0, limit) : activeIncidents;

  return (
    <View style={{ gap: spacing.listGap }}>
      {showHeader ? (
        <SectionHeader
          title="Active incidents"
          actionLabel={
            activeIncidents.length > 0 ? seeAllLabel(activeIncidents.length) : undefined
          }
          onActionPress={activeIncidents.length > 0 ? onSeeAllPress : undefined}
        />
      ) : null}

      {incidentsQuery.isLoading ? (
        <LoadingState message="Loading incidents…" />
      ) : incidentsQuery.isError ? (
        <ErrorState
          message="Couldn't load incidents."
          onRetry={() => incidentsQuery.refetch()}
        />
      ) : visibleIncidents.length === 0 ? (
        <EmptyState
          title="No active incidents"
          message="No coordinated responses are open."
        />
      ) : (
        visibleIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            {...toIncidentCardProps(incident)}
            onPress={() => router.push(`/incidents/${incident.id}`)}
          />
        ))
      )}
    </View>
  );
}
