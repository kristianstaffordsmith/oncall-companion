import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export default function IncidentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const incidentId = Array.isArray(id) ? id[0] : id;

  return (
    <Screen>
      <View style={styles.card}>
        <AppText variant="eyebrow">Incident</AppText>
        <AppText variant="title">Incident detail</AppText>
        <AppText style={styles.body}>
          Placeholder route for incident {incidentId ?? 'unknown'}. Timeline updates and AI
          summaries are implemented in later phases.
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
