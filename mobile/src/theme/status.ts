import type { components } from '@/api/generated';

import { colors } from './colors';

export type AlertStatus = components['schemas']['AlertStatus'];
export type IncidentStatus = components['schemas']['IncidentStatus'];

type StatusStyle = {
  fill: string;
  border: string;
  text: string;
  label: string;
};

type StatusDotStyle = {
  color: string;
  halo: string;
  label: string;
};

const alertStatusStyles: Record<AlertStatus, StatusStyle> = {
  triggered: { fill: '#F5C6A028', border: '#E8B888', text: '#F5D0A8', label: 'Triggered' },
  acknowledged: { fill: '#8BC4A828', border: '#8BC4A8', text: '#B8DEC8', label: 'Acknowledged' },
  resolved: { fill: '#8A9A9028', border: '#8A9A90', text: '#B8C4BC', label: 'Resolved' },
  escalated: { fill: '#E8A0B428', border: '#E8A0B4', text: '#F0C0CE', label: 'Escalated' },
};

const incidentStatusStyles: Record<IncidentStatus, StatusStyle> = {
  investigating: { fill: '#89CFF028', border: '#89CFF0', text: '#A8DDF4', label: 'Investigating' },
  fixing: { fill: '#C4A8E028', border: '#C4A8E0', text: '#D8C4EC', label: 'Fixing' },
  monitoring: { fill: '#F5D98A28', border: '#F5D98A', text: '#F5E0A8', label: 'Monitoring' },
  resolved: { fill: '#8A9A9028', border: '#8A9A90', text: '#B8C4BC', label: 'Resolved' },
};

const alertStatusDotStyles: Record<AlertStatus, StatusDotStyle> = {
  triggered: { color: '#F0C898', halo: 'rgba(240, 200, 152, 0.34)', label: 'Triggered' },
  acknowledged: { color: '#A8DCC0', halo: 'rgba(168, 220, 192, 0.34)', label: 'Acknowledged' },
  resolved: { color: '#B8C4BC', halo: 'rgba(184, 196, 188, 0.28)', label: 'Resolved' },
  escalated: { color: '#F0B0C4', halo: 'rgba(240, 176, 196, 0.34)', label: 'Escalated' },
};

const incidentStatusDotStyles: Record<IncidentStatus, StatusDotStyle> = {
  investigating: { color: '#9DD4F0', halo: 'rgba(157, 212, 240, 0.34)', label: 'Investigating' },
  fixing: { color: '#D4B8EC', halo: 'rgba(212, 184, 236, 0.34)', label: 'Fixing' },
  monitoring: { color: '#F8E098', halo: 'rgba(248, 224, 152, 0.34)', label: 'Monitoring' },
  resolved: { color: '#B8C4BC', halo: 'rgba(184, 196, 188, 0.28)', label: 'Resolved' },
};

export function getAlertStatusStyle(status: AlertStatus): StatusStyle {
  return alertStatusStyles[status];
}

export function getIncidentStatusStyle(status: IncidentStatus): StatusStyle {
  return incidentStatusStyles[status];
}

export function getAlertStatusDotStyle(status: AlertStatus): StatusDotStyle {
  return alertStatusDotStyles[status];
}

export function getIncidentStatusDotStyle(status: IncidentStatus): StatusDotStyle {
  return incidentStatusDotStyles[status];
}
