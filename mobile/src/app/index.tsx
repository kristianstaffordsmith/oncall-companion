import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <AppText variant="eyebrow">Mobile on-call demo</AppText>
        <AppText variant="title">OnCall Companion</AppText>
        <AppText style={styles.subtitle}>
          Triage alerts, create incidents, and generate structured summaries from an iOS-first
          workflow.
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="sectionTitle">Phase 8 shell</AppText>
        <AppText style={styles.body}>
          Routing, React Query, theme tokens, and the typed API client are wired up. The alert and
          incident workflows come next.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  subtitle: {
    color: colors.textMuted,
  },
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
