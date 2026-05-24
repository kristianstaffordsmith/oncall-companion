import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedToast } from '@/components/AnimatedToast';
import { spacing } from '@/theme/spacing';
import { useMarkNotificationRead, useUnreadNotifications } from '@/features/notifications/hooks';

type ToastKind = 'ephemeral' | 'notification';

type ActiveToast = {
  key: string;
  kind: ToastKind;
  title: string;
  body?: string;
  durationMs?: number;
  notificationId?: string;
  alertId?: string | null;
};

type ShowToastInput = {
  title: string;
  body?: string;
  durationMs?: number;
};

type AppToastContextValue = {
  showToast: (input: ShowToastInput) => void;
};

const AppToastContext = createContext<AppToastContextValue | null>(null);

const EPHEMERAL_DURATION_MS = 2500;

type Props = {
  children: ReactNode;
};

export function AppToastProvider({ children }: Props) {
  const insets = useSafeAreaInsets();
  const notificationsQuery = useUnreadNotifications();
  const markRead = useMarkNotificationRead();

  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);
  const [pendingNotification, setPendingNotification] = useState<ActiveToast | null>(null);
  const activeToastRef = useRef<ActiveToast | null>(null);

  activeToastRef.current = activeToast;

  const showToast = useCallback((input: ShowToastInput) => {
    setActiveToast({
      key: `ephemeral-${Date.now()}`,
      kind: 'ephemeral',
      title: input.title,
      body: input.body,
      durationMs: input.durationMs ?? EPHEMERAL_DURATION_MS,
    });
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  useEffect(() => {
    const latest = notificationsQuery.data?.[0];

    if (!latest) {
      return;
    }

    const next: ActiveToast = {
      key: latest.id,
      kind: 'notification',
      title: latest.title,
      body: latest.body,
      notificationId: latest.id,
      alertId: latest.alert_id,
    };

    if (activeToastRef.current) {
      setPendingNotification(next);
      return;
    }

    setActiveToast(next);
  }, [notificationsQuery.data]);

  useEffect(() => {
    if (activeToast !== null || !pendingNotification) {
      return;
    }

    setActiveToast(pendingNotification);
    setPendingNotification(null);
  }, [activeToast, pendingNotification]);

  function handleNotificationPress() {
    if (!activeToast?.notificationId) {
      return;
    }

    markRead.mutate(activeToast.notificationId);

    if (activeToast.alertId) {
      router.push(`/alerts/${activeToast.alertId}`);
    }
  }

  const animatedToast = activeToast
    ? {
        key: activeToast.key,
        title: activeToast.title,
        body: activeToast.body,
        durationMs: activeToast.kind === 'ephemeral' ? activeToast.durationMs : undefined,
        onPress: activeToast.kind === 'notification' ? handleNotificationPress : undefined,
      }
    : null;

  return (
    <AppToastContext.Provider value={{ showToast }}>
      {children}

      <View
        pointerEvents="box-none"
        style={[styles.overlay, { paddingTop: insets.top + spacing.sm }]}
      >
        <AnimatedToast toast={animatedToast} onDismiss={dismissToast} />
      </View>
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(AppToastContext);

  if (!context) {
    throw new Error('useAppToast must be used within AppToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
    zIndex: 100,
  },
});
