module.exports = {
  serverUrl: process.env.API_URL || 'http://127.0.0.1:8000/api/v1',
  wsServerUrl: process.env.WS_URL || 'ws://127.0.0.1:8000',
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:8000',
  captchaKey: process.env.CAPTCHA_KEY,
  stripeKey: process.env.STRIPE_KEY || 'pk_test_VWJmJ3yOunhMBkG71SXyjdqk',
  ravenDSN: process.env.RAVEN_DSN,
  release: process.env.RELEASE,
  environment: process.env.ENVIRONMENT,
  timezone: 'Europe/Oslo'
};
