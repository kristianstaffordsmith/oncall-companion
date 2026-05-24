import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { NotificationToast } from '@/components/NotificationToast';

type ToastContent = {
  key: string;
  title: string;
  body?: string;
  onPress?: () => void;
  durationMs?: number;
};

type Props = {
  toast: ToastContent | null;
  onDismiss: () => void;
};

const ENTRANCE_DELAY_MS = 360;
const ENTRANCE_DURATION_MS = 340;
const EXIT_DURATION_MS = 320;

export function AnimatedToast({ toast, onDismiss }: Props) {
  const translateY = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  function dismissWithAnimation(onComplete?: () => void) {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -24,
        duration: EXIT_DURATION_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_DURATION_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onComplete?.();
        dismissRef.current();
      }
    });
  }

  useEffect(() => {
    if (!toast) {
      return;
    }

    translateY.setValue(-24);
    opacity.setValue(0);

    const entrance = Animated.sequence([
      Animated.delay(ENTRANCE_DELAY_MS),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: ENTRANCE_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ENTRANCE_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    entrance.start();

    if (!toast.durationMs) {
      return;
    }

    const timeout = setTimeout(() => {
      dismissWithAnimation();
    }, toast.durationMs);

    return () => {
      entrance.stop();
      clearTimeout(timeout);
    };
    // toast is keyed by toast.key; avoid re-running on parent re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast?.key, toast?.durationMs]);

  if (!toast) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <NotificationToast
        title={toast.title}
        body={toast.body}
        highlighted
        onPress={
          toast.onPress
            ? () => {
                dismissWithAnimation(toast.onPress);
              }
            : undefined
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
