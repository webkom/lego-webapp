export interface AppConfig {
  serverUrl: string;
  wsServerUrl: string;
  baseUrl: string;
  webUrl: string;
  captchaKey: string;
  skipCaptcha: boolean;
  stripeKey: string;
  sentryDSN?: string;
  release?: string;
  environment: 'production' | 'staging' | 'local_staging' | 'ci' | undefined; // local development uses undefined
  timezone: string;
}

const env = import.meta.env.SSR ? process.env : ({} as Record<string, string>);

const defaultAppConfig = {
  serverUrl: env.API_URL || 'http://127.0.0.1:8000/api/v1',
  wsServerUrl: env.WS_URL || 'ws://127.0.0.1:8001',
  baseUrl: env.BASE_URL || 'http://127.0.0.1:8000',
  webUrl: env.WEB_URL || 'http://127.0.0.1:3000',
  captchaKey: env.CAPTCHA_KEY || '1x00000000000000000000AA',
  // Requires captchaKey to be the default value (test key)
  skipCaptcha: env.SKIP_CAPTCHA || false,
  stripeKey: env.STRIPE_KEY || 'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
  sentryDSN: env.SENTRY_DSN,
  release: env.RELEASE,
  environment: env.ENVIRONMENT,
  timezone: 'Europe/Oslo',
};

export const appConfig: AppConfig = import.meta.env.SSR
  ? defaultAppConfig
  : window.__CONFIG__ || defaultAppConfig;

export default appConfig;
