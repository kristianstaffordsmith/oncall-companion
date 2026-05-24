import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SeveritySelector } from '@/components/SeveritySelector';
import { TextField } from '@/components/TextField';
import type { components } from '@/api/generated';
import { queryKeys } from '@/api/queryKeys';
import {
  getCreateIncidentErrorMessage,
  isCreateIncidentConflict,
} from '@/features/alerts/createIncidentErrors';
import { useCreateIncidentFromAlert } from '@/features/alerts/hooks';
import { colors } from '@/theme/colors';
import type { Severity } from '@/theme/severity';
import { spacing } from '@/theme/spacing';

type Alert = components['schemas']['Alert'];

type Props = {
  visible: boolean;
  alert: Alert;
  onClose: () => void;
};

export function CreateIncidentSheet({ visible, alert, onClose }: Props) {
  const queryClient = useQueryClient();
  const createIncident = useCreateIncidentFromAlert(alert.id);
  const { mutate, reset, isPending, isError, error } = createIncident;

  const [title, setTitle] = useState(alert.title);
  const [severity, setSeverity] = useState<Severity>(alert.severity);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTitle(alert.title);
    setSeverity(alert.severity);
    reset();
  }, [visible, alert.title, alert.severity, reset]);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && !isPending;

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    mutate(
      { title: trimmedTitle, severity },
      {
        onSuccess: (detail) => {
          onClose();
          router.push(`/incidents/${detail.incident.id}`);
        },
        onError: (error) => {
          if (isCreateIncidentConflict(error)) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.alert(alert.id) });
            onClose();
          }
        },
      },
    );
  }

  return (
    <BottomSheet
      visible={visible}
      title="Create incident"
      onClose={onClose}
      dismissable={!isPending}
    >
      <TextField label="Incident title" value={title} onChangeText={setTitle} autoFocus />

      <SeveritySelector value={severity} onChange={setSeverity} />

      <AppText variant="caption" style={styles.hint}>
        You will be added as the incident creator.
      </AppText>

      <PrimaryButton
        label="Create incident"
        onPress={handleSubmit}
        loading={isPending}
        disabled={!canSubmit}
      />

      {isError ? (
        <AppText variant="caption" style={styles.error}>
          {getCreateIncidentErrorMessage(error)}
        </AppText>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.textMuted,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
});
