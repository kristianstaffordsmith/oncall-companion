import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import {
  getAlertStatusDotStyle,
  getIncidentStatusDotStyle,
  type AlertStatus,
  type IncidentStatus,
} from '@/theme/status';

type Props =
  | { kind: 'alert'; status: AlertStatus }
  | { kind: 'incident'; status: IncidentStatus };

export function StatusDot(props: Props) {
  const style =
    props.kind === 'alert'
      ? getAlertStatusDotStyle(props.status)
      : getIncidentStatusDotStyle(props.status);

  return (
    <View style={styles.container}>
      <View style={styles.dotWrap}>
        <View style={[styles.halo, { backgroundColor: style.halo }]} />
        <View style={[styles.dot, { backgroundColor: style.color }]} />
      </View>
      <AppText variant="caption" style={{ color: style.color }}>
        {style.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
});
