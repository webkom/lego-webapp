import { prepare } from '@webkom/react-prepare';
import type { ReactNode } from 'react';

const SSR_TIMEOUT_MS = 4000;

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export const isTimeoutError = (error: unknown): error is TimeoutError =>
  error instanceof TimeoutError;

export const prepareWithTimeout = (app: ReactNode): Promise<string> =>
  Promise.race([
    prepare(app),
    new Promise((resolve) => {
      setTimeout(resolve, SSR_TIMEOUT_MS);
    }).then(() => {
      throw new TimeoutError(
        'React prepare timeout when server side rendering.',
      );
    }),
  ]);
