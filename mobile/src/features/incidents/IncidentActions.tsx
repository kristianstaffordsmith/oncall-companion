import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { spacing } from '@/theme/spacing';

type Props = {
  onAddUpdatePress: () => void;
};

export function IncidentActions({ onAddUpdatePress }: Props) {
  return (
    <View style={styles.container}>
      <PrimaryButton label="Add update" onPress={onAddUpdatePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
