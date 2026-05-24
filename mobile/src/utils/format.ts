export function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatServiceLine(serviceName: string, environment: string): string {
  return `${serviceName} • ${environment}`;
}
