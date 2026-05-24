export function formatAlertMetadata(
  serviceName: string,
  environment: string,
  triggeredAt?: string,
  timeAgo?: string,
): string {
  const parts = [serviceName, environment];
  if (timeAgo) {
    parts.push(timeAgo);
  } else if (triggeredAt) {
    parts.push(triggeredAt);
  }
  return parts.join(' · ');
}

export function formatIncidentMetadata(reference: string, serviceName: string): string {
  return `${reference} · ${serviceName}`;
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
