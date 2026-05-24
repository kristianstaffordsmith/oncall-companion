import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type TextStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { typography } from '@/theme/typography';

type Props = {
  children: ReactNode;
  variant?: keyof typeof typography;
  style?: StyleProp<TextStyle>;
};

export function BlinkingLabel({ children, variant = 'caption', style }: Props) {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [blink]);

  return (
    <Animated.View style={{ opacity: blink }}>
      <AppText variant={variant} style={style}>
        {children}
      </AppText>
    </Animated.View>
  );
}
