export default interface Config {
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
