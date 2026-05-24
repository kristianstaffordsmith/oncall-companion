import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  backLabel?: string;
  centerTitle?: boolean;
};

function ScreenBackButton({
  label,
  style,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={() => router.back()}
      style={({ pressed }) => [styles.backButton, style, pressed ? styles.pressed : null]}
    >
      <AppText style={styles.backArrow}>‹</AppText>
      <AppText style={styles.backLabel}>{label}</AppText>
    </Pressable>
  );
}

export function ScreenHeader({ title, backLabel = 'Back', centerTitle = false }: Props) {
  if (centerTitle) {
    return (
      <View style={styles.inlineContainer}>
        <ScreenBackButton label={backLabel} style={styles.inlineBack} />

        <AppText variant="body" style={styles.centeredTitle} numberOfLines={1}>
          {title}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenBackButton label={backLabel} />
      <AppText variant="sectionTitle">{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  inlineContainer: {
    minHeight: 44,
    justifyContent: 'center',
  },
  inlineBack: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  centeredTitle: {
    textAlign: 'center',
    paddingHorizontal: 88,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    minHeight: 44,
    justifyContent: 'center',
    marginTop: -1,
  },
  backArrow: {
    color: colors.textMuted,
    fontSize: 26,
    lineHeight: 26,
    fontWeight: '500',
    marginTop: 2,
  },
  backLabel: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
