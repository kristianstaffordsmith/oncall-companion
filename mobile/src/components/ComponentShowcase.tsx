import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionRow } from '@/components/ActionRow';
import { AlertCard } from '@/components/AlertCard';
import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { IncidentCard } from '@/components/IncidentCard';
import { LinkRow } from '@/components/LinkRow';
import { LoadingState } from '@/components/LoadingState';
import { MetadataRow } from '@/components/MetadataRow';
import { NotificationToast } from '@/components/NotificationToast';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryAction } from '@/components/SecondaryAction';
import { SectionCard } from '@/components/SectionCard';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusPill } from '@/components/StatusPill';
import { Timeline } from '@/components/Timeline';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const timelineItems = [
  {
    id: '1',
    time: new Date(Date.now() - 8 * 60_000).toISOString(),
    title: 'Alert triggered',
    subtitle: 'External monitoring detected elevated errors',
  },
  {
    id: '2',
    time: new Date(Date.now() - 6 * 60_000).toISOString(),
    title: 'Kristian paged',
    tone: 'warning' as const,
  },
  {
    id: '3',
    time: new Date(Date.now() - 2 * 60_000).toISOString(),
    title: 'Awaiting acknowledgement',
    tone: 'success' as const,
  },
];

export function ComponentShowcase() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  return (
    <View style={styles.container}>
      <SectionCard title="Severity">
        <View style={styles.row}>
          <SeverityPill severity="critical" />
          <SeverityPill severity="high" />
          <SeverityPill severity="medium" />
          <SeverityPill severity="low" />
        </View>
      </SectionCard>

      <SectionCard title="Status">
        <View style={styles.row}>
          <StatusPill kind="alert" status="triggered" />
          <StatusPill kind="alert" status="acknowledged" />
          <StatusPill kind="incident" status="investigating" />
        </View>
      </SectionCard>

      <SectionCard title="Actions">
        <PrimaryButton label="Acknowledge Alert" onPress={() => undefined} />
        <PrimaryButton label="Loading" loading onPress={() => undefined} />
        <PrimaryButton label="Disabled" disabled onPress={() => undefined} />
        <ActionRow>
          <SecondaryAction label="Create Incident" onPress={() => undefined} />
          <SecondaryAction label="Resolve Alert" onPress={() => undefined} destructive />
          <SecondaryAction label="Escalate" onPress={() => undefined} />
        </ActionRow>
      </SectionCard>

      <SectionCard title="Cards">
        <AlertCard
          title="Elevated API error rate"
          serviceName="payments-api"
          environment="production"
          severity="critical"
          status="triggered"
          triggeredAt={new Date(Date.now() - 3 * 60_000).toISOString()}
          onPress={() => undefined}
        />
        <IncidentCard
          reference="INC-104"
          title="Elevated API error rate"
          severity="critical"
          status="investigating"
          serviceName="payments-api"
          onPress={() => undefined}
        />
      </SectionCard>

      <SectionCard title="Metadata">
        <MetadataRow label="Metric" value="http.server.errors.rate" />
        <MetadataRow label="Threshold" value="> 5% for 5 minutes" />
        <MetadataRow label="Current value" value="12.4%" />
        <LinkRow label="Runbook" url="https://example.com/runbooks/payments-api" />
      </SectionCard>

      <SectionCard title="Timeline">
        <Timeline items={timelineItems} />
      </SectionCard>

      <SectionCard title="Feedback states">
        <EmptyState
          title="No active alerts"
          message="When monitoring fires, new alerts will appear here."
        />
        <LoadingState />
        <ErrorState message="Couldn't load alerts" onRetry={() => undefined} />
      </SectionCard>

      <SectionCard title="Overlays">
        <NotificationToast
          title="You have been paged"
          body="Elevated API error rate on payments-api"
          onPress={() => undefined}
        />
        <PrimaryButton label="Show confirm dialog" onPress={() => setConfirmVisible(true)} />
        <PrimaryButton label="Show bottom sheet" onPress={() => setSheetVisible(true)} />
        <PrimaryButton
          label={loadingDemo ? 'Loading demo active' : 'Toggle loading demo'}
          onPress={() => setLoadingDemo((value) => !value)}
        />
        {loadingDemo ? <LoadingState message="Refreshing alerts…" /> : null}
      </SectionCard>

      <AppText variant="caption" style={styles.footer}>
        Component showcase for Phase 9. Replaced by the real home screen in Phase 10.
      </AppText>

      <ConfirmDialog
        visible={confirmVisible}
        title="Resolve alert?"
        message="This will stop escalation and mark the alert as resolved."
        confirmLabel="Resolve"
        destructive
        onConfirm={() => setConfirmVisible(false)}
        onCancel={() => setConfirmVisible(false)}
      />

      <BottomSheet
        visible={sheetVisible}
        title="Create incident"
        onClose={() => setSheetVisible(false)}
      >
        <AppText variant="body" style={styles.sheetCopy}>
          Sheet content for create incident, add update, and AI summary flows arrives in later
          phases.
        </AppText>
        <PrimaryButton label="Close" onPress={() => setSheetVisible(false)} />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  sheetCopy: {
    color: colors.textSecondary,
  },
});
