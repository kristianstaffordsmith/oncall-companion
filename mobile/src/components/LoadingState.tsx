import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Spinner } from '@/components/Spinner';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: Props) {
  return (
    <View style={styles.container}>
      <Spinner size={28} />
      <AppText variant="body" style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  message: {
    color: colors.textSecondary,
  },
});
