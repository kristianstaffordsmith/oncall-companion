import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryAction } from '@/components/SecondaryAction';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.dialog} onStartShouldSetResponder={() => true}>
          <AppText variant="sectionTitle">{title}</AppText>
          <AppText variant="body" style={styles.message}>
            {message}
          </AppText>
          {destructive ? (
            <AppText variant="caption" style={styles.destructiveHint}>
              This action cannot be undone.
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <SecondaryAction label={cancelLabel} onPress={onCancel} />
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'destructive' : 'primary'}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  dialog: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  message: {
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
  },
  destructiveHint: {
    color: colors.danger,
  },
});
