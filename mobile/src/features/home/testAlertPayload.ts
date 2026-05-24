import type { components } from '@/api/generated';

export const testAlertPayload: components['schemas']['CreateAlertWebhookRequest'] = {
  title: 'Elevated API error rate',
  service_name: 'payments-api',
  environment: 'production',
  severity: 'critical',
  source: 'external-monitoring',
  summary: '500 errors increased from 0.2% to 12.4% over 5 minutes.',
  metric_name: 'http.server.errors.rate',
  threshold: '> 5% for 5 minutes',
  current_value: '12.4%',
  affected_customers: 'approx. 18%',
  runbook_url: 'https://example.com/runbooks/payments-api',
  dashboard_url: 'https://example.com/dashboards/payments-api',
  logs_url: 'https://example.com/logs/payments-api',
};
