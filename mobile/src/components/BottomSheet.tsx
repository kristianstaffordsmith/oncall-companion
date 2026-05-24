import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  dismissable?: boolean;
  minHeight?: number | `${number}%`;
  children: ReactNode;
};

export function BottomSheet({
  visible,
  title,
  onClose,
  dismissable = true,
  minHeight,
  children,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={dismissable ? onClose : undefined}
    >
      <Pressable style={styles.backdrop} onPress={dismissable ? onClose : undefined}>
        <View
          style={[styles.sheet, minHeight != null ? { minHeight } : null]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handle} />
          <AppText variant="sectionTitle">{title}</AppText>
          <View style={styles.content}>{children}</View>
        </View>
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
    paddingHorizontal: spacing.lg,
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
});
