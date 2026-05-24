import { ApiError } from '@/api/errors';

export function throwIfError<T>(
  error: T | undefined,
  response: Response,
): asserts error is undefined {
  if (error) {
    throw new ApiError(response.status, error);
  }
}
