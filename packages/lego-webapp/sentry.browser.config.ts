import * as Sentry from '@sentry/react';
import { appConfig } from '~/utils/appConfig';

export const sentryBrowserConfig = () => {
  Sentry.init({
    dsn: appConfig.sentryDSN,
    environment: appConfig.environment,
    release: appConfig.release,
    enabled: !import.meta.env.DEV,
    normalizeDepth: 10,
  });
};
