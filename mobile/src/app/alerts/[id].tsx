import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export default function AlertDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const alertId = Array.isArray(id) ? id[0] : id;

  return (
    <Screen>
      <View style={styles.card}>
        <AppText variant="eyebrow">Alert</AppText>
        <AppText variant="title">Alert detail</AppText>
        <AppText style={styles.body}>
          Placeholder route for alert {alertId ?? 'unknown'}. The full triage flow is implemented
          in a later phase.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  body: {
    color: colors.textSecondary,
  },
});
