import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.row}>
      <AppText variant="sectionTitle" style={styles.title}>
        {title}
      </AppText>
      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [styles.action, pressed ? styles.actionPressed : null]}
        >
          <AppText variant="caption" style={styles.actionLabel}>
            {actionLabel}
          </AppText>
          <AppText variant="caption" style={styles.chevron}>
            ›
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionLabel: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '500',
  },
});
