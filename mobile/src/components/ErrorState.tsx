import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { SecondaryAction } from '@/components/SecondaryAction';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message = "Couldn't load data", onRetry }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="sectionTitle" style={styles.title}>
        Something went wrong
      </AppText>
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
      {onRetry ? <SecondaryAction label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  title: {
    color: colors.danger,
  },
  message: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
