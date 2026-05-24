import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/api/queryClient';
import { NotificationProvider } from '@/features/notifications/NotificationProvider';
import { colors, fontFamily } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '600', color: colors.text, fontFamily },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="alerts/index" options={{ headerShown: false }} />
            <Stack.Screen name="alerts/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="incidents/index" options={{ headerShown: false }} />
            <Stack.Screen name="incidents/[id]" options={{ headerShown: false }} />
          </Stack>
        </NotificationProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
