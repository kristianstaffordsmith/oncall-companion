import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  label: string;
  value: string;
};

export function MetadataRow({ label, value }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="body">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
  },
});
