import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { BottomSheet } from '@/components/BottomSheet';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { useAddIncidentUpdate } from '@/features/incidents/hooks';
import { colors } from '@/theme/colors';

type Props = {
  visible: boolean;
  incidentId: string;
  onClose: () => void;
};

export function AddUpdateSheet({ visible, incidentId, onClose }: Props) {
  const addUpdate = useAddIncidentUpdate(incidentId);
  const { mutate, reset, isPending, isError } = addUpdate;

  const [body, setBody] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    setBody('');
    reset();
  }, [visible, reset]);

  const trimmedBody = body.trim();
  const canSubmit = trimmedBody.length > 0 && !isPending;

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    mutate(trimmedBody, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <BottomSheet
      visible={visible}
      title="Add update"
      onClose={onClose}
      dismissable={!isPending}
      minHeight="44%"
    >
      <TextField
        label="Update"
        value={body}
        onChangeText={setBody}
        placeholder="Share what you're seeing or doing next…"
        multiline
        numberOfLines={4}
        autoFocus
      />

      <PrimaryButton
        label="Add update"
        onPress={handleSubmit}
        loading={isPending}
        disabled={!canSubmit}
      />

      {isError ? (
        <AppText variant="caption" style={styles.error}>
          Couldn't add update. Try again.
        </AppText>
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    textAlign: 'center',
  },
});
