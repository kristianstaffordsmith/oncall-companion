import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const detailHeaderStyles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.lg,
  },
  metadata: {
    color: colors.textMuted,
  },
});

export const detailScreenHeaderBlockStyles = StyleSheet.create({
  block: {
    gap: spacing.sm,
  },
});
