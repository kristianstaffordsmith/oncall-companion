import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export function SecondaryAction({
  label,
  onPress,
  destructive = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.button, pressed && !disabled ? styles.pressed : null]}
    >
      <AppText
        variant="caption"
        style={{
          color: disabled ? colors.textMuted : destructive ? colors.danger : colors.textSecondary,
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
