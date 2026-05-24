import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { DetailMetaRow } from '@/components/DetailMetaRow';
import { detailHeaderStyles } from '@/components/detailHeaderStyles';
import { SeverityPill } from '@/components/SeverityPill';
import { StatusDot } from '@/components/StatusDot';
import type { components } from '@/api/generated';
import { formatRelativeTime } from '@/utils/date';
import { formatServiceLine } from '@/utils/format';

type Alert = components['schemas']['Alert'];

type Props = {
  alert: Alert;
};

export function AlertDetailHeader({ alert }: Props) {
  const startedLabel = `started ${formatRelativeTime(alert.triggered_at)}`;

  return (
    <View style={detailHeaderStyles.container}>
      <DetailMetaRow
        left={
          <AppText variant="caption" style={detailHeaderStyles.metadata} numberOfLines={1}>
            {formatServiceLine(alert.service_name, alert.environment)}
          </AppText>
        }
        right={<SeverityPill severity={alert.severity} />}
      />

      <AppText variant="detailTitle" style={detailHeaderStyles.title} numberOfLines={2}>
        {alert.title}
      </AppText>

      <DetailMetaRow
        left={
          <AppText variant="caption" style={detailHeaderStyles.metadata} numberOfLines={1}>
            {startedLabel}
          </AppText>
        }
        right={<StatusDot kind="alert" status={alert.status} />}
      />
    </View>
  );
}
