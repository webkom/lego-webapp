import prepare from '@webkom/react-prepare';
import { ReactNode } from 'react';

const serverSideTimeoutInMs = 4000;

export const prepareWithTimeout = (app: ReactNode): Promise<string> =>
  Promise.race([
    prepare(app),
    new Promise((resolve) => {
      setTimeout(resolve, serverSideTimeoutInMs);
    }).then(() => {
      throw new Error('React prepare timeout when server side rendering.');
    }),
  ]);
