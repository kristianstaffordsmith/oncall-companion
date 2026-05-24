import { StyleSheet, View } from 'react-native';

import { LinkRow } from '@/components/LinkRow';
import { SectionCard } from '@/components/SectionCard';
import type { components } from '@/api/generated';
import { spacing } from '@/theme/spacing';

type Alert = components['schemas']['Alert'];

type Props = {
  alert: Alert;
};

export function AlertLinksSection({ alert }: Props) {
  const links = [
    alert.dashboard_url ? { label: 'Dashboard', url: alert.dashboard_url } : null,
    alert.logs_url ? { label: 'Logs', url: alert.logs_url } : null,
    alert.runbook_url ? { label: 'Runbook', url: alert.runbook_url } : null,
  ].filter((link): link is { label: string; url: string } => link !== null);

  if (links.length === 0) {
    return null;
  }

  return (
    <SectionCard title="Links">
      <View style={styles.links}>
        {links.map((link) => (
          <LinkRow key={link.label} label={link.label} url={link.url} />
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  links: {
    gap: spacing.xs,
  },
});
