import type { components } from '@/api/generated';

import { colors } from './colors';

export type Severity = components['schemas']['Severity'];

type SeverityStyle = {
  fill: string;
  border: string;
  text: string;
  bar: string;
};

const severityStyles: Record<Severity, SeverityStyle> = {
  critical: {
    fill: 'rgba(248, 184, 168, 0.22)',
    border: 'rgba(248, 184, 168, 0.42)',
    text: colors.critical,
    bar: 'rgba(248, 184, 168, 0.90)',
  },
  high: {
    fill: 'rgba(240, 176, 196, 0.22)',
    border: 'rgba(240, 176, 196, 0.42)',
    text: colors.high,
    bar: 'rgba(240, 176, 196, 0.90)',
  },
  medium: {
    fill: 'rgba(248, 224, 152, 0.22)',
    border: 'rgba(248, 224, 152, 0.42)',
    text: colors.medium,
    bar: 'rgba(248, 224, 152, 0.90)',
  },
  low: {
    fill: 'rgba(157, 212, 240, 0.22)',
    border: 'rgba(157, 212, 240, 0.42)',
    text: colors.low,
    bar: 'rgba(157, 212, 240, 0.90)',
  },
};

export function getSeverityStyle(severity: Severity): SeverityStyle {
  return severityStyles[severity];
}
