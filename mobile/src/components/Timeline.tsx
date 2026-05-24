import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { formatTime } from '@/utils/date';

export type TimelineEntry = {
  id: string;
  time: string;
  title: string;
  subtitle?: string;
  tone?: 'default' | 'success' | 'warning';
};

type Props = {
  items: TimelineEntry[];
};

const toneColors = {
  default: colors.accent,
  success: colors.success,
  warning: colors.warning,
};

export function Timeline({ items }: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const tone = item.tone ?? 'default';
        const isLast = index === items.length - 1;

        return (
          <View key={item.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: toneColors[tone] }]} />
              {!isLast ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.content}>
              <AppText variant="caption" style={styles.time}>
                {formatTime(item.time)}
              </AppText>
              <AppText variant="body">{item.title}</AppText>
              {item.subtitle ? (
                <AppText variant="caption" style={styles.subtitle}>
                  {item.subtitle}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rail: {
    width: 16,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  time: {
    color: colors.textMuted,
  },
  subtitle: {
    color: colors.textSecondary,
  },
});
