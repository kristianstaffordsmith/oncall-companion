import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

type BottomSheetVariant = 'default' | 'aiSummary';

type VariantPreset = {
  height?: `${number}%`;
  minHeight?: `${number}%`;
  titleMarginTop?: number;
  titleMarginBottom?: number;
  paddingHorizontal?: number;
};

const variantPresets: Record<BottomSheetVariant, VariantPreset> = {
  default: {
    paddingHorizontal: spacing.lg,
  },
  aiSummary: {
    height: '65%',
    titleMarginTop: spacing.xl,
    titleMarginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
};

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  dismissable?: boolean;
  variant?: BottomSheetVariant;
  minHeight?: number | `${number}%`;
  children: ReactNode;
};

export function BottomSheet({
  visible,
  title,
  onClose,
  dismissable = true,
  variant = 'default',
  minHeight,
  children,
}: Props) {
  const preset = variantPresets[variant];
  const sheetHeight = preset.height;
  const sheetMinHeight = minHeight ?? preset.minHeight;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={dismissable ? onClose : undefined}
    >
      <Pressable style={styles.backdrop} onPress={dismissable ? onClose : undefined}>
        <Pressable
          style={[
            styles.sheet,
            { paddingHorizontal: preset.paddingHorizontal },
            sheetHeight != null ? { height: sheetHeight } : null,
            sheetMinHeight != null ? { minHeight: sheetMinHeight } : null,
          ]}
          onPress={() => undefined}
        >
          <View style={styles.handle} />
          <AppText
            variant="sectionTitle"
            style={{
              marginTop: preset.titleMarginTop,
              marginBottom: preset.titleMarginBottom,
            }}
          >
            {title}
          </AppText>
          <View style={[styles.content, sheetHeight != null ? styles.contentFlex : null]}>
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheet: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  content: {
    gap: spacing.md,
  },
  contentFlex: {
    flex: 1,
    minHeight: 0,
  },
});
