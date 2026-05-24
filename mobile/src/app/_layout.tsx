import { QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/api/queryClient';
import { DemoSplashOverlay } from '@/components/DemoSplashOverlay';
import { AppToastProvider } from '@/features/notifications/AppToastProvider';
import { colors, fontFamily } from '@/theme';

export default function RootLayout() {
  useEffect(() => {
    // Native splash does not show custom assets in Expo Go — hide it so the overlay takes over.
    void SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppToastProvider>
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
          <DemoSplashOverlay />
        </AppToastProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
