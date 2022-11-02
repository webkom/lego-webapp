const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  https: process.env.HTTPS || false,
  httpsCertKeyFile: process.env.HTTPS_CERT_KEY_FILE || './localhost-key.pem',
  httpsCertFile: process.env.HTTPS_CERT_FILE || './localhost.pem',
  sentryDSN: process.env.SERVER_SENTRY_DSN,
  release: process.env.RELEASE,
  environment: process.env.ENVIRONMENT
};
export default config;