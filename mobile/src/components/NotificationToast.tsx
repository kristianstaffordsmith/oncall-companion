import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  body?: string;
  onPress?: () => void;
  highlighted?: boolean;
};

export function NotificationToast({ title, body, onPress, highlighted = false }: Props) {
  const content = (
    <>
      <AppText variant="button" style={styles.title}>
        {title}
      </AppText>
      {body ? (
        <AppText variant="body" style={styles.body}>
          {body}
        </AppText>
      ) : null}
    </>
  );

  const toastStyle = [styles.toast, highlighted ? styles.toastHighlighted : null];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [toastStyle, pressed ? styles.pressed : null]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={toastStyle}>{content}</View>;
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
  toastHighlighted: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
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
