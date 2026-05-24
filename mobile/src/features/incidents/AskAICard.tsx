import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { cardStyles, getCardStyle } from '@/theme/cards';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function AskAICard({ onPress, disabled = false }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        getCardStyle('hero'),
        styles.card,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View style={cardStyles.insetHighlight} pointerEvents="none" />

      <AppText variant="button" style={styles.cta}>
        ✨ Ask AI
      </AppText>

      <AppText variant="body" style={styles.description}>
        Get a structured summary, likely cause, suggested actions, and draft comms from this
        incident.
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceOnCall,
    borderColor: colors.borderOnCall,
    borderWidth: 1,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
  cta: {
    alignSelf: 'flex-start',
    color: colors.accent,
  },
  description: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
