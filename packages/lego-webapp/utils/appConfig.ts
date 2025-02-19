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

export const appConfig = {
  serverUrl: import.meta.env.API_URL || 'http://127.0.0.1:8000/api/v1',
  wsServerUrl: import.meta.env.WS_URL || 'ws://127.0.0.1:8001',
  baseUrl: import.meta.env.BASE_URL || 'http://127.0.0.1:8000',
  webUrl: import.meta.env.WEB_URL || 'http://127.0.0.1:3000',
  captchaKey: import.meta.env.CAPTCHA_KEY || '1x00000000000000000000AA',
  // Requires captchaKey to be the default value (test key)
  skipCaptcha: import.meta.env.SKIP_CAPTCHA || false,
  stripeKey: import.meta.env.STRIPE_KEY || 'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
  sentryDSN: import.meta.env.SENTRY_DSN,
  release: import.meta.env.RELEASE,
  environment: import.meta.env.ENVIRONMENT,
  timezone: 'Europe/Oslo',
} as AppConfig;

export default appConfig;
