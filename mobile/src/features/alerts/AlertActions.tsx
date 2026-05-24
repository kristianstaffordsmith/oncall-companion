import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryAction } from '@/components/SecondaryAction';
import type { components } from '@/api/generated';
import { AcknowledgeButton } from '@/features/alerts/AcknowledgeButton';
import { getNextPendingEscalation } from '@/features/alerts/escalation';
import {
  useAcknowledgeAlert,
  useEscalateAlert,
  useResolveAlert,
} from '@/features/alerts/hooks';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Alert = components['schemas']['Alert'];
type EscalationEvent = components['schemas']['EscalationEvent'];

type Props = {
  alert: Alert;
  escalationEvents: EscalationEvent[];
  onCreateIncidentPress: () => void;
};

export function AlertActions({ alert, escalationEvents, onCreateIncidentPress }: Props) {
  const [resolveVisible, setResolveVisible] = useState(false);
  const [escalateVisible, setEscalateVisible] = useState(false);

  const acknowledgeMutation = useAcknowledgeAlert(alert.id);
  const resolveMutation = useResolveAlert(alert.id);
  const escalateMutation = useEscalateAlert(alert.id);

  const isResolved = alert.status === 'resolved';
  const isAcknowledged = alert.status === 'acknowledged';
  const canAcknowledge = alert.status === 'triggered' || alert.status === 'escalated';
  const canEscalate = alert.status === 'triggered';
  const canResolve = !isResolved;
  const linkedIncidentId = alert.linked_incident_id;
  const nextPending = getNextPendingEscalation(escalationEvents);

  const handleCreateIncident = () => {
    if (linkedIncidentId) {
      router.push(`/incidents/${linkedIncidentId}`);
      return;
    }

    onCreateIncidentPress();
  };

  if (isResolved) {
    if (linkedIncidentId) {
      return (
        <View style={styles.container}>
          <PrimaryButton label="View incident" onPress={handleCreateIncident} />
        </View>
      );
    }

    return null;
  }

  const createIncidentPrimary = isAcknowledged;
  const createIncidentLabel = linkedIncidentId ? 'View incident' : 'Create incident';

  const createIncidentAction = createIncidentPrimary ? (
    <PrimaryButton label={createIncidentLabel} onPress={handleCreateIncident} />
  ) : (
    <SecondaryAction label={createIncidentLabel} onPress={handleCreateIncident} />
  );

  const secondaryActionError = resolveMutation.isError
    ? "Couldn't resolve alert. Try again."
    : escalateMutation.isError
      ? "Couldn't escalate alert. Try again."
      : null;

  return (
    <View style={styles.container}>
      {canAcknowledge ? (
        <View style={styles.primaryBlock}>
          <AcknowledgeButton
            onPress={() => acknowledgeMutation.mutate()}
            loading={acknowledgeMutation.isPending}
          />
          {acknowledgeMutation.isError ? (
            <AppText variant="caption" style={styles.error}>
              Couldn't acknowledge alert. Try again.
            </AppText>
          ) : null}
        </View>
      ) : null}

      {createIncidentPrimary ? createIncidentAction : null}

      <View style={styles.secondaryActions}>
        {!createIncidentPrimary ? createIncidentAction : null}

        {canResolve ? (
          <SecondaryAction
            label="Resolve alert"
            onPress={() => setResolveVisible(true)}
            disabled={resolveMutation.isPending}
          />
        ) : null}

        {canEscalate ? (
          <SecondaryAction
            label="Escalate to secondary"
            onPress={() => setEscalateVisible(true)}
            disabled={escalateMutation.isPending}
          />
        ) : null}
      </View>

      <ConfirmDialog
        visible={resolveVisible}
        title="Resolve alert?"
        message="This stops escalation notifications."
        confirmLabel="Resolve"
        onConfirm={() => {
          setResolveVisible(false);
          resolveMutation.mutate();
        }}
        onCancel={() => setResolveVisible(false)}
      />

      <ConfirmDialog
        visible={escalateVisible}
        title={nextPending ? `Notify ${nextPending.user.name}?` : 'Escalate alert?'}
        message={
          nextPending
            ? `${nextPending.user.name} will immediately receive this alert.`
            : 'The next responder will immediately receive this alert.'
        }
        confirmLabel={nextPending ? `Notify ${nextPending.user.name}` : 'Escalate'}
        onConfirm={() => {
          setEscalateVisible(false);
          escalateMutation.mutate();
        }}
        onCancel={() => setEscalateVisible(false)}
      />

      {secondaryActionError ? (
        <AppText variant="caption" style={styles.error}>
          {secondaryActionError}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  primaryBlock: {
    gap: spacing.xs,
  },
  secondaryActions: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
});
