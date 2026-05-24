import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  body: string;
  onPress: () => void;
};

export function NotificationToast({ title, body, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.toast, pressed ? styles.pressed : null]}
    >
      <AppText variant="button" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" style={styles.body}>
        {body}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toast: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.toast,
  },
  title: {
    color: colors.text,
  },
  body: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.92,
  },
});
