import type { components } from '@/api/generated';

import { colors } from './colors';

export type Severity = components['schemas']['Severity'];

type SeverityStyle = {
  fill: string;
  border: string;
  text: string;
};

const severityStyles: Record<Severity, SeverityStyle> = {
  critical: { fill: '#F4A89628', border: colors.critical, text: '#F8C4B8' },
  high: { fill: '#E8A0B428', border: colors.high, text: '#F0C0CE' },
  medium: { fill: '#F5D98A28', border: colors.medium, text: '#F5E0A8' },
  low: { fill: '#89CFF028', border: colors.low, text: '#A8DDF4' },
};

export function getSeverityStyle(severity: Severity): SeverityStyle {
  return severityStyles[severity];
}
