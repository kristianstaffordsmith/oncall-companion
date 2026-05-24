import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DEMO_USER_ID } from '@/constants/demoUser';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import { formatTime } from '@/utils/date';

type Props = {
  acknowledgedAt: string;
  acknowledgedBy?: string | null;
};

export function AcknowledgedBanner({ acknowledgedAt, acknowledgedBy }: Props) {
  const isYou = !acknowledgedBy || acknowledgedBy === DEMO_USER_ID;
  const label = isYou
    ? `Acknowledged by you at ${formatTime(acknowledgedAt)}`
    : `Acknowledged at ${formatTime(acknowledgedAt)}`;

  return (
    <View style={styles.banner}>
      <AppText variant="body" style={styles.text}>
        ✓ {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: 'rgba(139, 196, 168, 0.12)',
  },
  text: {
    color: colors.success,
    fontWeight: '600',
  },
});
