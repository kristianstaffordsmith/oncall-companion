import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/api/queryClient';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'OnCall Companion' }} />
        <Stack.Screen name="alerts/[id]" options={{ title: 'Alert detail' }} />
        <Stack.Screen name="incidents/[id]" options={{ title: 'Incident detail' }} />
      </Stack>
    </QueryClientProvider>
  );
}
