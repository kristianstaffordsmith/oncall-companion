export const queryKeys = {
  me: ['me'] as const,
  currentSchedule: ['schedule', 'current'] as const,
  alerts: ['alerts'] as const,
  alert: (id: string) => ['alerts', id] as const,
  incidents: ['incidents'] as const,
  incident: (id: string) => ['incidents', id] as const,
  notifications: ['notifications'] as const,
};
