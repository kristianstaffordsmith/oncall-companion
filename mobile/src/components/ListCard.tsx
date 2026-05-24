import { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { cardStyles, getCardStyle } from '@/theme/cards';
import { type Severity, getSeverityStyle } from '@/theme/severity';

type Props = {
  severity?: Severity;
  accentColor?: string;
  onPress?: () => void;
  children: ReactNode;
};

export function ListCard({ severity, accentColor, onPress, children }: Props) {
  const barColor =
    accentColor ?? (severity ? getSeverityStyle(severity).bar : undefined);

  const content = (
    <>
      <View style={cardStyles.insetHighlight} pointerEvents="none" />
      {barColor ? (
        <View
          style={[cardStyles.accentBar, { backgroundColor: barColor }]}
          pointerEvents="none"
        />
      ) : null}
      <View style={styles.inner}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          getCardStyle('listItem'),
          pressed ? styles.pressed : null,
          pressed ? styles.pressedBorder : null,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={getCardStyle('listItem')}>{content}</View>;
}

const styles = StyleSheet.create({
  inner: {
    gap: 12,
  },
  pressed: {
    opacity: 0.96,
  },
  pressedBorder: {
    borderColor: 'rgba(255,255,255,0.16)',
  },
});
