import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import type { components } from '@/api/generated';
import { formatCountdown } from '@/features/alerts/escalation';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

type EscalationEvent = components['schemas']['EscalationEvent'];

type Props = {
  event: EscalationEvent;
};

export function EscalationBanner({ event }: Props) {
  const [countdown, setCountdown] = useState(() => formatCountdown(event.notify_at));

  useEffect(() => {
    setCountdown(formatCountdown(event.notify_at));

    const interval = setInterval(() => {
      setCountdown(formatCountdown(event.notify_at));
    }, 1000);

    return () => clearInterval(interval);
  }, [event.notify_at]);

  return (
    <View style={styles.banner}>
      <AppText variant="body" style={styles.text}>
        ⚠ Escalates to {event.user.name} in {countdown}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: 'rgba(232, 184, 136, 0.12)',
  },
  text: {
    color: colors.warning,
    fontWeight: '600',
  },
});
