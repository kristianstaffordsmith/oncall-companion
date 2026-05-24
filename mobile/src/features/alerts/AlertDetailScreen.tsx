import { useState } from 'react';
import { View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { DetailScreenHeaderBlock } from '@/components/DetailScreenHeaderBlock';
import { Screen } from '@/components/Screen';
import { AcknowledgedBanner } from '@/features/alerts/AcknowledgedBanner';
import { AlertActions } from '@/features/alerts/AlertActions';
import { AlertContextCard } from '@/features/alerts/AlertContextCard';
import { AlertDetailHeader } from '@/features/alerts/AlertDetailHeader';
import { AlertLinksSection } from '@/features/alerts/AlertLinksSection';
import { CreateIncidentSheet } from '@/features/alerts/CreateIncidentSheet';
import { EscalationBanner } from '@/features/alerts/EscalationBanner';
import { EscalationTimeline } from '@/features/alerts/EscalationTimeline';
import {
  getNextPendingEscalation,
  shouldShowEscalationBanner,
} from '@/features/alerts/escalation';
import { useAlert } from '@/features/alerts/hooks';
import { spacing } from '@/theme/spacing';

type Props = {
  alertId: string;
};

export function AlertDetailScreen({ alertId }: Props) {
  const [createIncidentVisible, setCreateIncidentVisible] = useState(false);
  const alertQuery = useAlert(alertId);

  if (alertQuery.isLoading) {
    return (
      <Screen>
        <DetailScreenHeaderBlock title="Alert" />
        <LoadingState message="Loading alert…" />
      </Screen>
    );
  }

  if (alertQuery.isError || !alertQuery.data) {
    return (
      <Screen>
        <DetailScreenHeaderBlock title="Alert" />
        <ErrorState message="Couldn't load this alert." onRetry={() => alertQuery.refetch()} />
      </Screen>
    );
  }

  const { alert, escalation_events: escalationEvents } = alertQuery.data;
  const nextPending = getNextPendingEscalation(escalationEvents);
  const showEscalationBanner = shouldShowEscalationBanner(alert, escalationEvents);

  return (
    <>
      <Screen>
        <DetailScreenHeaderBlock title="Alert">
          <AlertDetailHeader alert={alert} />
        </DetailScreenHeaderBlock>

        {showEscalationBanner && nextPending ? <EscalationBanner event={nextPending} /> : null}

        {alert.acknowledged_at ? (
          <AcknowledgedBanner
            acknowledgedAt={alert.acknowledged_at}
            acknowledgedBy={alert.acknowledged_by}
          />
        ) : null}

        <AlertContextCard alert={alert} />
        <AlertLinksSection alert={alert} />
        <EscalationTimeline alert={alert} events={escalationEvents} />

        <View style={{ gap: spacing.md }}>
          <AlertActions
            alert={alert}
            escalationEvents={escalationEvents}
            onCreateIncidentPress={() => setCreateIncidentVisible(true)}
          />
        </View>
      </Screen>

      <CreateIncidentSheet
        visible={createIncidentVisible}
        alert={alert}
        onClose={() => setCreateIncidentVisible(false)}
      />
    </>
  );
}
