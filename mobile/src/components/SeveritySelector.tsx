import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { getSeverityStyle, type Severity } from '@/theme/severity';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const SEVERITIES: Severity[] = ['critical', 'high', 'medium', 'low'];

type Props = {
  value: Severity;
  onChange: (severity: Severity) => void;
};

export function SeveritySelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        Severity
      </AppText>
      <View style={styles.options}>
        {SEVERITIES.map((severity) => {
          const style = getSeverityStyle(severity);
          const selected = severity === value;

          return (
            <Pressable
              key={severity}
              onPress={() => onChange(severity)}
              style={[
                styles.option,
                {
                  backgroundColor: style.fill,
                  borderColor: selected ? style.text : style.border,
                },
                selected ? styles.optionSelected : null,
              ]}
            >
              <AppText
                variant="pill"
                style={{ color: style.text, textTransform: 'uppercase' }}
              >
                {severity}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderWidth: 2,
  },
});
