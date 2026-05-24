import { View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IncidentCard } from '@/components/IncidentCard';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import {
  isActiveIncident,
  sortIncidentsNewestFirst,
} from '@/features/home/selectors';
import { useIncidents } from '@/features/incidents/hooks';
import { spacing } from '@/theme/spacing';
import { formatIncidentMetadata } from '@/utils/format';

export function IncidentListScreen() {
  const incidentsQuery = useIncidents();
  const activeIncidents = sortIncidentsNewestFirst(
    incidentsQuery.data?.filter(isActiveIncident) ?? [],
  );

  return (
    <Screen>
      <ScreenHeader title="Incidents" />
      {incidentsQuery.isLoading ? (
        <LoadingState message="Loading incidents…" />
      ) : incidentsQuery.isError ? (
        <ErrorState
          message="Couldn't load incidents."
          onRetry={() => incidentsQuery.refetch()}
        />
      ) : activeIncidents.length === 0 ? (
        <EmptyState
          title="No active incidents"
          message="No coordinated responses are open."
        />
      ) : (
        <View style={{ gap: spacing.listGap }}>
          {activeIncidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              title={incident.title}
              metadata={formatIncidentMetadata(incident.reference, incident.service_name)}
              severity={incident.severity}
              status={incident.status}
              onPress={() => router.push(`/incidents/${incident.id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
