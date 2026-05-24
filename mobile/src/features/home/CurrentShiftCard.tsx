import { StyleSheet, View } from 'react-native';

import type { components } from '@/api/generated';
import { AppText } from '@/components/AppText';
import { cardStyles, getCardStyle } from '@/theme/cards';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { formatTime } from '@/utils/date';

type Props = {
  shift: components['schemas']['CurrentShift'];
};

export function CurrentShiftCard({ shift }: Props) {
  return (
    <View style={[getCardStyle('hero'), styles.card]}>
      <View style={cardStyles.insetHighlight} pointerEvents="none" />
      <AppText variant="label" style={styles.eyebrow}>
        You're on call
      </AppText>
      <AppText variant="title" style={styles.identity} numberOfLines={2}>
        {shift.user.name} · {shift.role}
      </AppText>
      <View style={styles.untilRow}>
        <AppText variant="caption" style={styles.clock}>
          ◷
        </AppText>
        <AppText variant="caption" style={styles.until}>
          Until {formatTime(shift.ends_at)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceOnCall,
    borderColor: colors.borderOnCall,
    borderWidth: 1,
  },
  eyebrow: {
    color: colors.low,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  identity: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  untilRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
  },
  clock: {
    color: colors.textMuted,
    fontSize: 21,
    lineHeight: 22,
  },
  until: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 2,
  },
});
