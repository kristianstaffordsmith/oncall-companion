import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  backLabel?: string;
};

export function ScreenHeader({ title, backLabel = 'Back' }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed ? styles.pressed : null]}
      >
        <AppText style={styles.backArrow}>‹</AppText>
        <AppText style={styles.backLabel}>{backLabel}</AppText>
      </Pressable>
      <AppText variant="sectionTitle">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  backArrow: {
    color: colors.textMuted,
    fontSize: 26,
    lineHeight: 26,
    fontWeight: '500',
    marginTop: 2,
  },
  backLabel: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
