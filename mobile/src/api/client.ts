import createClient from 'openapi-fetch';

import type { paths } from './generated';

export const api = createClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080',
});
