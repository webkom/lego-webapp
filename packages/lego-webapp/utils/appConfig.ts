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

export const appConfig: AppConfig = import.meta.env.SSR
  ? {
      serverUrl:
        import.meta.env.PUBLIC_ENV__API_URL || 'http://127.0.0.1:8000/api/v1',
      wsServerUrl: import.meta.env.PUBLIC_ENV__WS_URL || 'ws://127.0.0.1:8001',
      baseUrl: import.meta.env.PUBLIC_ENV__BASE_URL || 'http://127.0.0.1:8000',
      webUrl: import.meta.env.PUBLIC_ENV__WEB_URL || 'http://127.0.0.1:3000',
      captchaKey:
        import.meta.env.PUBLIC_ENV__CAPTCHA_KEY || '1x00000000000000000000AA',
      // Requires captchaKey to be the default value (test key)
      skipCaptcha: import.meta.env.PUBLIC_ENV__SKIP_CAPTCHA || false,
      stripeKey:
        import.meta.env.PUBLIC_ENV__STRIPE_KEY ||
        'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
      sentryDSN: import.meta.env.PUBLIC_ENV__SENTRY_DSN,
      release: import.meta.env.PUBLIC_ENV__RELEASE,
      environment: import.meta.env.PUBLIC_ENV__ENVIRONMENT,
      timezone: 'Europe/Oslo',
    }
  : window.__CONFIG__;


export default appConfig;
