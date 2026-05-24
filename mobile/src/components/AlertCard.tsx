import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { type Severity } from '@/theme/severity';
import { shadows } from '@/theme/shadows';
import { type AlertStatus } from '@/theme/status';
import { spacing } from '@/theme/spacing';
import { formatRelativeTime } from '@/utils/date';
import { formatServiceLine } from '@/utils/format';

type Props = {
  title: string;
  serviceName: string;
  environment: string;
  severity: Severity;
  status: AlertStatus;
  triggeredAt?: string;
  onPress: () => void;
};

export function AlertCard({
  title,
  serviceName,
  environment,
  severity,
  status,
  triggeredAt,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <SeverityPill severity={severity} />
      <AppText variant="sectionTitle">{title}</AppText>
      <View style={styles.metaRow}>
        <AppText variant="caption" style={styles.meta}>
          {formatServiceLine(serviceName, environment)}
        </AppText>
        <StatusPill kind="alert" status={status} />
      </View>
      {triggeredAt ? (
        <AppText variant="caption" style={styles.meta}>
          {formatRelativeTime(triggeredAt)}
        </AppText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  meta: {
    color: colors.textMuted,
  },
  pressed: {
    opacity: 0.92,
  },
});
