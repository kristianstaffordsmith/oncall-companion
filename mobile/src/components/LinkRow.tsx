import { Linking, Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  label: string;
  url: string;
};

export function LinkRow({ label, url }: Props) {
  return (
    <Pressable
      onPress={() => {
        void Linking.openURL(url);
      }}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="caption" style={styles.hint}>
        Open
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingVertical: spacing.xs,
  },
  label: {
    color: colors.accent,
    fontWeight: '700',
  },
  hint: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.75,
  },
});
