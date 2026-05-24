import { View } from 'react-native';
import { router } from 'expo-router';

import { AlertCard } from '@/components/AlertCard';
import { BrandHeader } from '@/components/BrandHeader';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IncidentCard } from '@/components/IncidentCard';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { useAlerts } from '@/features/alerts/hooks';
import { CurrentShiftCard } from '@/features/home/CurrentShiftCard';
import {
  isActiveAlert,
  isActiveIncident,
  previewItems,
  seeAllLabel,
  sortAlertsNewestFirst,
  sortIncidentsNewestFirst,
} from '@/features/home/selectors';
import { TriggerTestAlertButton } from '@/features/home/TriggerTestAlertButton';
import { useIncidents } from '@/features/incidents/hooks';
import { useCurrentSchedule } from '@/features/schedule/hooks';
import { spacing } from '@/theme/spacing';
import { formatRelativeTime } from '@/utils/date';
import { formatAlertMetadata, formatIncidentMetadata } from '@/utils/format';

export function HomeScreen() {
  const scheduleQuery = useCurrentSchedule();
  const alertsQuery = useAlerts();
  const incidentsQuery = useIncidents();

  const activeAlerts = sortAlertsNewestFirst(
    alertsQuery.data?.filter(isActiveAlert) ?? [],
  );
  const activeIncidents = sortIncidentsNewestFirst(
    incidentsQuery.data?.filter(isActiveIncident) ?? [],
  );

  const alertPreview = previewItems(activeAlerts);
  const incidentPreview = previewItems(activeIncidents);

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

      <View style={{ gap: spacing.listGap }}>
        <SectionHeader
          title="Active alerts"
          actionLabel={activeAlerts.length > 0 ? seeAllLabel(activeAlerts.length) : undefined}
          onActionPress={
            activeAlerts.length > 0 ? () => router.push('/alerts') : undefined
          }
        />
        {alertsQuery.isLoading ? (
          <LoadingState message="Loading alerts…" />
        ) : alertsQuery.isError ? (
          <ErrorState message="Couldn't load alerts." onRetry={() => alertsQuery.refetch()} />
        ) : alertPreview.length === 0 ? (
          <EmptyState title="No active alerts" message="Monitoring is quiet right now." />
        ) : (
          alertPreview.map((alert) => (
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
          ))
        )}
      </View>

      <View style={{ gap: spacing.listGap }}>
        <SectionHeader
          title="Active incidents"
          actionLabel={
            activeIncidents.length > 0 ? seeAllLabel(activeIncidents.length) : undefined
          }
          onActionPress={
            activeIncidents.length > 0 ? () => router.push('/incidents') : undefined
          }
        />
        {incidentsQuery.isLoading ? (
          <LoadingState message="Loading incidents…" />
        ) : incidentsQuery.isError ? (
          <ErrorState
            message="Couldn't load incidents."
            onRetry={() => incidentsQuery.refetch()}
          />
        ) : incidentPreview.length === 0 ? (
          <EmptyState
            title="No active incidents"
            message="No coordinated responses are open."
          />
        ) : (
          incidentPreview.map((incident) => (
            <IncidentCard
              key={incident.id}
              title={incident.title}
              metadata={formatIncidentMetadata(incident.reference, incident.service_name)}
              severity={incident.severity}
              status={incident.status}
              onPress={() => router.push(`/incidents/${incident.id}`)}
            />
          ))
        )}
      </View>

      <TriggerTestAlertButton />
    </Screen>
  );
}
