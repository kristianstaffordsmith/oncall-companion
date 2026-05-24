export class ApiError<T = unknown> extends Error {
  readonly status: number;
  readonly body: T;

  constructor(status: number, body: T) {
    super(getApiErrorMessage(body));
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function getApiErrorMessage(body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const message = (body as { error: unknown }).error;
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Request failed';
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiConflict(error: unknown): boolean {
  return isApiError(error) && error.status === 409;
}
