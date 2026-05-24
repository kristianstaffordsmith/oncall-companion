import { StyleSheet, type ViewStyle } from 'react-native';

import { colors } from './colors';
import { radii } from './radii';
import { spacing } from './spacing';

export type CardVariant = 'hero' | 'listItem';

export function getCardStyle(variant: CardVariant): ViewStyle {
  return variant === 'hero' ? cardStyles.hero : cardStyles.listItem;
}

export const cardStyles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    padding: spacing.cardPaddingHero,
    overflow: 'hidden',
  },
  listItem: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHairline,
    padding: spacing.cardPaddingList,
    overflow: 'hidden',
  },
  insetHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.borderHighlight,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});
