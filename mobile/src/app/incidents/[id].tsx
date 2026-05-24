import { useLocalSearchParams } from 'expo-router';

import { IncidentDetailScreen } from '@/features/incidents/IncidentDetailScreen';

export default function IncidentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const incidentId = Array.isArray(id) ? id[0] : id;

  if (!incidentId) {
    return null;
  }

  return <IncidentDetailScreen incidentId={incidentId} />;
}
