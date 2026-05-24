import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { cardStyles, getCardStyle } from '@/theme/cards';
import { spacing } from '@/theme/spacing';

type Props = {
  title?: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <View style={[getCardStyle('hero'), styles.card]}>
      <View style={cardStyles.insetHighlight} pointerEvents="none" />
      {title ? <AppText variant="sectionTitle">{title}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
});
