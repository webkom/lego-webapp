module.exports = {
  serverUrl: process.env.API_URL || 'http://127.0.0.1:8000/api/v1',
  wsServerUrl: process.env.WS_URL || 'ws://127.0.0.1:8000',
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8000',
  webUrl: process.env.WEB_URL || 'http://127.0.0.1:3000',
  segmentWriteKey:
    process.env.SEGMENT_WRITE_KEY || 'AwzecATYd1qiH21IY0hruqg63Q4QwZtO',
  captchaKey:
    process.env.CAPTCHA_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  stripeKey: process.env.STRIPE_KEY || 'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
  ravenDSN: process.env.RAVEN_DSN,
  release: process.env.RELEASE,
  environment: process.env.ENVIRONMENT,
  timezone: 'Europe/Oslo'
};
