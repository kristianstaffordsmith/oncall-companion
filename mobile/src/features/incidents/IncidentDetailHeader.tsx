import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DetailMetaRow } from '@/components/DetailMetaRow';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusDot } from '@/components/StatusDot';
import type { components } from '@/api/generated';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Incident = components['schemas']['Incident'];

type Props = {
  incident: Incident;
};

export function IncidentDetailHeader({ incident }: Props) {
  return (
    <View style={styles.container}>
      <DetailMetaRow
        left={
          <AppText variant="eyebrow" numberOfLines={1}>
            {incident.reference}
          </AppText>
        }
        right={<SeverityPill severity={incident.severity} />}
      />

      <AppText variant="brandTitle" numberOfLines={2}>
        {incident.title}
      </AppText>

      <DetailMetaRow
        left={
          <AppText variant="caption" style={styles.metadata} numberOfLines={1}>
            {incident.service_name}
          </AppText>
        }
        right={<StatusDot kind="incident" status={incident.status} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  metadata: {
    color: colors.textMuted,
  },
});
