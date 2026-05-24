import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DetailMetaRow } from '@/components/DetailMetaRow';
import { detailHeaderStyles } from '@/components/detailHeaderStyles';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusDot } from '@/components/StatusDot';
import type { components } from '@/api/generated';

type Incident = components['schemas']['Incident'];

type Props = {
  incident: Incident;
};

export function IncidentDetailHeader({ incident }: Props) {
  return (
    <View style={detailHeaderStyles.container}>
      <DetailMetaRow
        left={
          <AppText variant="eyebrow" numberOfLines={1}>
            {incident.reference}
          </AppText>
        }
        right={<SeverityPill severity={incident.severity} />}
      />

      <AppText variant="detailTitle" style={detailHeaderStyles.title} numberOfLines={2}>
        {incident.title}
      </AppText>

      <DetailMetaRow
        left={
          <AppText variant="caption" style={detailHeaderStyles.metadata} numberOfLines={1}>
            {incident.service_name}
          </AppText>
        }
        right={<StatusDot kind="incident" status={incident.status} />}
      />
    </View>
  );
}
