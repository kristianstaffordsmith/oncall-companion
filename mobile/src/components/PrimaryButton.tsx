import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { Spinner } from '@/components/Spinner';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'destructive';
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: Props) {
  const isDisabled = disabled || loading;
  const isDestructive = variant === 'destructive';
  const labelColor = isDisabled
    ? colors.textMuted
    : isDestructive
      ? colors.text
      : colors.onPrimary;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled ? styles.disabled : isDestructive ? styles.destructive : styles.enabled,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
    >
      {loading ? (
        <Spinner size={22} color={labelColor} />
      ) : (
        <AppText variant="button" style={{ color: labelColor }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabled: {
    backgroundColor: colors.accent,
  },
  disabled: {
    backgroundColor: colors.accentMuted,
  },
  destructive: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.88,
  },
});
