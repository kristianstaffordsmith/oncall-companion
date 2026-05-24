import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  left: ReactNode;
  right: ReactNode;
};

export function DetailMetaRow({ left, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>{left}</View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  right: {
    flexShrink: 0,
  },
});
