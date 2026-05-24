import { useState } from 'react';
import { View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { DetailScreenHeaderBlock } from '@/components/DetailScreenHeaderBlock';
import { Screen } from '@/components/Screen';
import { AddUpdateSheet } from '@/features/incidents/AddUpdateSheet';
import { AISummarySheet } from '@/features/incidents/AISummarySheet';
import { AskAICard } from '@/features/incidents/AskAICard';
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
  const [summaryVisible, setSummaryVisible] = useState(false);
  const incidentQuery = useIncident(incidentId);

  if (incidentQuery.isLoading) {
    return (
      <Screen>
        <DetailScreenHeaderBlock title="Incident" />
        <LoadingState message="Loading incident…" />
      </Screen>
    );
  }

  if (incidentQuery.isError || !incidentQuery.data) {
    return (
      <Screen>
        <DetailScreenHeaderBlock title="Incident" />
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
        <DetailScreenHeaderBlock title="Incident">
          <IncidentDetailHeader incident={incident} />
        </DetailScreenHeaderBlock>
        <AskAICard onPress={() => setSummaryVisible(true)} disabled={summaryVisible} />
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

      <AISummarySheet
        visible={summaryVisible}
        incidentId={incidentId}
        onClose={() => setSummaryVisible(false)}
      />
    </>
  );
}
