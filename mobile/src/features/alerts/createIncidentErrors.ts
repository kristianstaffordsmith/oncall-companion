import { isApiConflict } from '@/api/errors';

export function isCreateIncidentConflict(error: unknown): boolean {
  return isApiConflict(error);
}

export function getCreateIncidentErrorMessage(error: unknown): string {
  if (isCreateIncidentConflict(error)) {
    return 'An incident already exists for this alert.';
  }

  return "Couldn't create incident. Try again.";
}
