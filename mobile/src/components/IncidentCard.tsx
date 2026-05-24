import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { ListCard } from '@/components/ListCard';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusDot } from '@/components/StatusDot';
import { colors } from '@/theme/colors';
import { type Severity } from '@/theme/severity';
import { type IncidentStatus } from '@/theme/status';

type Props = {
  title: string;
  metadata: string;
  severity: Severity;
  status: IncidentStatus;
  onPress: () => void;
};

export function IncidentCard({ title, metadata, severity, status, onPress }: Props) {
  return (
    <ListCard accentColor={colors.incidentBar} onPress={onPress}>
      <View style={styles.titleRow}>
        <AppText variant="body" style={styles.title} numberOfLines={1}>
          {title}
        </AppText>
        <SeverityPill severity={severity} />
      </View>
      <StatusDot kind="incident" status={status} />
      <AppText variant="caption" style={styles.metadata} numberOfLines={1}>
        {metadata}
      </AppText>
    </ListCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
  },
  metadata: {
    color: colors.textMuted,
  },
});
