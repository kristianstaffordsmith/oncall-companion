import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radii } from '@/theme/radii';
import {
  getAlertStatusStyle,
  getIncidentStatusStyle,
  type AlertStatus,
  type IncidentStatus,
} from '@/theme/status';
import { spacing } from '@/theme/spacing';

type Props =
  | { kind: 'alert'; status: AlertStatus }
  | { kind: 'incident'; status: IncidentStatus };

export function StatusPill(props: Props) {
  const style =
    props.kind === 'alert'
      ? getAlertStatusStyle(props.status)
      : getIncidentStatusStyle(props.status);

  return (
    <View style={[styles.pill, { backgroundColor: style.fill, borderColor: style.border }]}>
      <AppText variant="pill" style={{ color: style.text }}>
        {style.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingTop: spacing.xs + 3,
    paddingBottom: spacing.xs + 1,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
});
