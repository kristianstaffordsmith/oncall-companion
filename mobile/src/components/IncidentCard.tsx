import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusPill } from '@/components/StatusPill';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { type Severity } from '@/theme/severity';
import { shadows } from '@/theme/shadows';
import { type IncidentStatus } from '@/theme/status';
import { spacing } from '@/theme/spacing';

type Props = {
  reference: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  serviceName: string;
  onPress: () => void;
};

export function IncidentCard({
  reference,
  title,
  severity,
  status,
  serviceName,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <AppText variant="eyebrow" style={styles.reference}>
        {reference}
      </AppText>
      <AppText variant="sectionTitle">{title}</AppText>
      <View style={styles.metaRow}>
        <SeverityPill severity={severity} />
        <StatusPill kind="incident" status={status} />
      </View>
      <AppText variant="caption" style={styles.meta}>
        {serviceName}
      </AppText>
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
  reference: {
    color: colors.textMuted,
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
