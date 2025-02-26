import * as Sentry from '@sentry/node';
import { appConfig } from './utils/appConfig';

export const sentryServerConfig = () => {
  Sentry.init({
    dsn: appConfig.sentryDSN,
    release: appConfig.release,
    environment: appConfig.environment,
    normalizeDepth: 10,
    integrations: [
      Sentry.rewriteFramesIntegration({
        root: '/app/dist/',
      }),
    ],
  });
};
