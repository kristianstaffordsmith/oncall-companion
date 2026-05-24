import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { queryClient } from '@/api/queryClient';
import { colors, fontFamily } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
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
          <Stack.Screen name="alerts/[id]" options={{ title: 'Alert detail' }} />
          <Stack.Screen name="incidents/[id]" options={{ title: 'Incident detail' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
