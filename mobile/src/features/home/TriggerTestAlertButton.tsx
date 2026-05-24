import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { useTriggerTestAlert } from '@/features/alerts/hooks';
import { useAppToast } from '@/features/notifications/AppToastProvider';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function TriggerTestAlertButton() {
  const triggerTestAlert = useTriggerTestAlert();
  const { showToast } = useAppToast();

  return (
    <View style={styles.wrap}>
      <SectionCard title="Demo">
        <AppText variant="caption" style={styles.description}>
          Fire a sample monitoring webhook to simulate being paged.
        </AppText>
        <PrimaryButton
          label="Trigger test alert"
          loading={triggerTestAlert.isPending}
          onPress={() =>
            triggerTestAlert.mutate(undefined, {
              onSuccess: () => {
                showToast({
                  title: 'Test alert triggered',
                  body: 'Sample monitoring webhook sent.',
                });
              },
            })
          }
        />
        {triggerTestAlert.isError ? (
          <AppText variant="caption" style={styles.error}>
            Couldn't trigger test alert. Check that the API is running.
          </AppText>
        ) : null}
      </SectionCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    opacity: 0.92,
  },
  description: {
    color: colors.textMuted,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
