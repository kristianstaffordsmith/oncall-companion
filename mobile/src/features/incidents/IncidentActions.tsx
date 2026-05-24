import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryAction } from '@/components/SecondaryAction';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  onAddUpdatePress: () => void;
};

export function IncidentActions({ onAddUpdatePress }: Props) {
  return (
    <View style={styles.container}>
      <PrimaryButton label="Add update" onPress={onAddUpdatePress} />

      <View style={styles.secondaryActions}>
        <SecondaryAction label="Generate summary" disabled />
        <AppText variant="caption" style={styles.hint}>
          AI summaries are coming in the next phase.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  secondaryActions: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  hint: {
    color: colors.textMuted,
    textAlign: 'center',
  },
});
