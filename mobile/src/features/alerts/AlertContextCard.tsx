import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { MetadataRow } from '@/components/MetadataRow';
import { SectionCard } from '@/components/SectionCard';
import type { components } from '@/api/generated';
import { spacing } from '@/theme/spacing';

type Alert = components['schemas']['Alert'];

type Props = {
  alert: Alert;
};

export function AlertContextCard({ alert }: Props) {
  const hasMetrics =
    alert.metric_name || alert.threshold || alert.current_value || alert.affected_customers;

  return (
    <View style={styles.container}>
      <SectionCard title="Summary">
        <AppText variant="body">{alert.summary}</AppText>
      </SectionCard>

      {hasMetrics ? (
        <SectionCard title="Context">
          {alert.metric_name ? <MetadataRow label="Metric" value={alert.metric_name} /> : null}
          {alert.threshold ? <MetadataRow label="Threshold" value={alert.threshold} /> : null}
          {alert.current_value ? (
            <MetadataRow label="Current value" value={alert.current_value} />
          ) : null}
          {alert.affected_customers ? (
            <MetadataRow label="Affected customers" value={alert.affected_customers} />
          ) : null}
        </SectionCard>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sectionGap,
  },
});
