import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { fontFamily, typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoFocus?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  autoFocus = false,
}: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        autoFocus={autoFocus}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, typography.body, !editable ? styles.inputDisabled : null]}
        value={value}
      />
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
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    fontFamily,
  },
  inputDisabled: {
    opacity: 0.6,
  },
});
