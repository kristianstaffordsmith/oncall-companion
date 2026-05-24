import { View } from 'react-native';
import { router } from 'expo-router';

import { AlertCard } from '@/components/AlertCard';
import { SectionCard } from '@/components/SectionCard';
import type { components } from '@/api/generated';
import { toLinkedAlertCardProps } from '@/features/incidents/selectors';
import { spacing } from '@/theme/spacing';

type Alert = components['schemas']['Alert'];

type Props = {
  alerts: Alert[];
};

export function LinkedAlertsSection({ alerts }: Props) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <SectionCard title="Linked alerts">
      <View style={{ gap: spacing.listGap }}>
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            {...toLinkedAlertCardProps(alert)}
            onPress={() => router.push(`/alerts/${alert.id}`)}
          />
        ))}
      </View>
    </SectionCard>
  );
}
