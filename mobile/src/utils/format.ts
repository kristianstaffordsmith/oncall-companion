export function formatAlertMetadata(
  serviceName: string,
  environment: string,
  timeAgo?: string,
): string {
  const parts = [serviceName, environment];
  if (timeAgo) {
    parts.push(timeAgo);
  }
  return parts.join(' · ');
}

export function formatIncidentMetadata(reference: string, serviceName: string): string {
  return `${reference} · ${serviceName}`;
}

export function seeAllLabel(count: number): string {
  return count > 2 ? `See all (${count})` : 'See all';
}

export function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatServiceLine(serviceName: string, environment: string): string {
  return `${serviceName} · ${environment}`;
}
