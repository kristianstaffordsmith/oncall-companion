import { type ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationToast } from '@/components/NotificationToast';
import { spacing } from '@/theme/spacing';
import { useMarkNotificationRead, useUnreadNotifications } from '@/features/notifications/hooks';

type ActiveToast = {
  id: string;
  title: string;
  body: string;
  alert_id?: string | null;
};

type Props = {
  children: ReactNode;
};

export function NotificationProvider({ children }: Props) {
  const insets = useSafeAreaInsets();
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);
  const notificationsQuery = useUnreadNotifications();
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    const latest = notificationsQuery.data?.[0];

    if (!latest || activeToast) {
      return;
    }

    setActiveToast({
      id: latest.id,
      title: latest.title,
      body: latest.body,
      alert_id: latest.alert_id,
    });
  }, [notificationsQuery.data, activeToast]);

  function handlePressToast() {
    if (!activeToast) {
      return;
    }

    markRead.mutate(activeToast.id);

    if (activeToast.alert_id) {
      router.push(`/alerts/${activeToast.alert_id}`);
    }

    setActiveToast(null);
  }

  return (
    <>
      {children}

      {activeToast ? (
        <View
          pointerEvents="box-none"
          style={[styles.overlay, { paddingTop: insets.top + spacing.sm }]}
        >
          <NotificationToast
            title={activeToast.title}
            body={activeToast.body}
            onPress={handlePressToast}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    zIndex: 100,
  },
});
