import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/spacing';

type Props = {
  children: ReactNode;
};

export function ActionRow({ children }: Props) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
});
