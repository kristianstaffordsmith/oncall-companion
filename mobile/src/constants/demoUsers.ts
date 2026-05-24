export const DEMO_USERS = {
  '00000000-0000-0000-0000-000000000001': 'Kristian',
  '00000000-0000-0000-0000-000000000002': 'Maya',
  '00000000-0000-0000-0000-000000000003': 'Sam',
} as const;

export function getDemoUserName(userId: string): string {
  return DEMO_USERS[userId as keyof typeof DEMO_USERS] ?? 'Team member';
}
