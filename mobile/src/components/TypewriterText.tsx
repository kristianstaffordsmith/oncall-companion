import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, type TextStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type Props = {
  text: string;
  speedMs?: number;
  onComplete?: () => void;
  variant?: keyof typeof typography;
  style?: TextStyle;
};

export function TypewriterText({
  text,
  speedMs = 20,
  onComplete,
  variant = 'body',
  style,
}: Props) {
  const [visibleLength, setVisibleLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const cursorBlink = useRef(new Animated.Value(1)).current;
  const onCompleteRef = useRef(onComplete);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    setVisibleLength(0);
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setVisibleLength(index);

      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlink, {
          toValue: 0.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cursorBlink, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [cursorBlink, isComplete]);

  const displayed = text.slice(0, visibleLength);

  return (
    <AppText variant={variant} style={style}>
      {displayed}
      {!isComplete ? (
        <Animated.Text style={[styles.cursor, { opacity: cursorBlink }]}>|</Animated.Text>
      ) : null}
    </AppText>
  );
}

const styles = {
  cursor: {
    color: colors.textMuted,
  },
};
