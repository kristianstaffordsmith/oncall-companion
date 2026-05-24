import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusDot } from '@/components/StatusDot';
import type { components } from '@/api/generated';
import { spacing } from '@/theme/spacing';
import { formatRelativeTime } from '@/utils/date';
import { formatAlertMetadata } from '@/utils/format';

type Alert = components['schemas']['Alert'];

type Props = {
  alert: Alert;
};

export function AlertDetailHeader({ alert }: Props) {
  const startedLabel = `started ${formatRelativeTime(alert.triggered_at)}`;

  return (
    <View style={styles.container}>
      <View style={styles.badges}>
        <SeverityPill severity={alert.severity} />
        <StatusDot kind="alert" status={alert.status} />
      </View>
      <AppText variant="title">{alert.title}</AppText>
      <AppText variant="caption" style={styles.metadata}>
        {formatAlertMetadata(alert.service_name, alert.environment, startedLabel)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  metadata: {
    color: 'rgba(250,250,250,0.85)',
  },
});
