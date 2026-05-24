import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { radii } from '@/theme/radii';
import { getSeverityStyle, type Severity } from '@/theme/severity';
import { spacing } from '@/theme/spacing';

type Props = {
  severity: Severity;
};

export function SeverityPill({ severity }: Props) {
  const style = getSeverityStyle(severity);

  return (
    <View style={[styles.pill, { backgroundColor: style.fill, borderColor: style.border }]}>
      <AppText variant="pill" style={{ color: style.text, textTransform: 'uppercase' }}>
        {severity}
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
