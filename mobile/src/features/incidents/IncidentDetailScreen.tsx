import { useState } from 'react';
import { View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { AddUpdateSheet } from '@/features/incidents/AddUpdateSheet';
import { IncidentActions } from '@/features/incidents/IncidentActions';
import { IncidentDetailHeader } from '@/features/incidents/IncidentDetailHeader';
import { IncidentRespondersSection } from '@/features/incidents/IncidentRespondersSection';
import { IncidentTimeline } from '@/features/incidents/IncidentTimeline';
import { LinkedAlertsSection } from '@/features/incidents/LinkedAlertsSection';
import { useIncident } from '@/features/incidents/hooks';
import { spacing } from '@/theme/spacing';

type Props = {
  incidentId: string;
};

export function IncidentDetailScreen({ incidentId }: Props) {
  const [addUpdateVisible, setAddUpdateVisible] = useState(false);
  const incidentQuery = useIncident(incidentId);

  if (incidentQuery.isLoading) {
    return (
      <Screen>
        <ScreenHeader title="Incident" centerTitle />
        <LoadingState message="Loading incident…" />
      </Screen>
    );
  }

  if (incidentQuery.isError || !incidentQuery.data) {
    return (
      <Screen>
        <ScreenHeader title="Incident" centerTitle />
        <ErrorState
          message="Couldn't load this incident."
          onRetry={() => incidentQuery.refetch()}
        />
      </Screen>
    );
  }

  const { incident, linked_alerts: linkedAlerts, updates } = incidentQuery.data;

  return (
    <>
      <Screen>
        <ScreenHeader title="Incident" centerTitle />

        <IncidentDetailHeader incident={incident} />
        <IncidentRespondersSection createdBy={incident.created_by} />
        <LinkedAlertsSection alerts={linkedAlerts} />
        <IncidentTimeline incident={incident} linkedAlerts={linkedAlerts} updates={updates} />

        <View style={{ gap: spacing.md }}>
          <IncidentActions onAddUpdatePress={() => setAddUpdateVisible(true)} />
        </View>
      </Screen>

      <AddUpdateSheet
        visible={addUpdateVisible}
        incidentId={incidentId}
        onClose={() => setAddUpdateVisible(false)}
      />
    </>
  );
}
