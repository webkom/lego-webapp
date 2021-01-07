// baseConfig is the base config, should be sent to client
//
// When this config is sent to the client, it will act as the "normal" config
//
// See the file `app/config.js` for more info.
const config = {
  serverUrl: process.env.API_URL || 'http://127.0.0.1:8000/api/v1',
  wsServerUrl: process.env.WS_URL || 'ws://127.0.0.1:8000',
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8000',
  webUrl: process.env.WEB_URL || 'http://127.0.0.1:3000',
  segmentWriteKey:
    process.env.SEGMENT_WRITE_KEY || 'AwzecATYd1qiH21IY0hruqg63Q4QwZtO',
  captchaKey:
    process.env.CAPTCHA_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  // Requires captchaKey to be the default value (test key)
  skipCaptcha: process.env.SKIP_CAPTCHA,
  stripeKey: process.env.STRIPE_KEY || 'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
  sentryDSN: process.env.SENTRY_DSN,
  release: process.env.RELEASE,
  environment: process.env.ENVIRONMENT,
  timezone: 'Europe/Oslo',
};

// This config is for the server side renderer (SSR),
// so that we can use the internal api-urls
export const configWithSSR = {
  ...config,
  serverUrl: process.env.SSR_API_URL || config.serverUrl,
  baseUrl: process.env.SSR_BASE_URL || config.baseUrl,
};

// User ssrConfig as default export config. Only SSR imports this file
export default config;
