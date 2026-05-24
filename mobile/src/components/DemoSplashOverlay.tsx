import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

const headerFlame = require('../../assets/images/header-flame.png');

// Demo-only: delete this file when moving off Expo Go / before shipping.
const SPLASH_LOGO_SIZE = 180;
const BACKGROUND_ONLY_MS = 600;
const LOGO_FADE_IN_MS = 800;
const HOLD_MS = 1000;
const LOGO_FADE_OUT_MS = 600;
const SCREEN_FADE_OUT_MS = 700;

export function DemoSplashOverlay() {
  const [visible, setVisible] = useState(true);
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(BACKGROUND_ONLY_MS),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: LOGO_FADE_IN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(HOLD_MS),
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: LOGO_FADE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: SCREEN_FADE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });

    return () => animation.stop();
  }, [logoOpacity, overlayOpacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.overlay, { opacity: overlayOpacity }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.Image
        source={headerFlame}
        style={[styles.logo, { opacity: logoOpacity }]}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    elevation: 9999,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SPLASH_LOGO_SIZE,
    height: SPLASH_LOGO_SIZE,
  },
});
