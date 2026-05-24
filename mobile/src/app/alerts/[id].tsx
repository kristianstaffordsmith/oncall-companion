import { useLocalSearchParams } from 'expo-router';

import { AlertDetailScreen } from '@/features/alerts/AlertDetailScreen';

export default function AlertDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const alertId = Array.isArray(id) ? id[0] : id;

  if (!alertId) {
    return null;
  }

  return <AlertDetailScreen alertId={alertId} />;
}
