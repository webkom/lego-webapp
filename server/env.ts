const config = {
  host: import.meta.env.HOST,
  port: import.meta.env.PORT,
  https: import.meta.env.HTTPS || false,
  httpsCertKeyFile:
    import.meta.env.HTTPS_CERT_KEY_FILE || './localhost-key.pem',
  httpsCertFile: import.meta.env.HTTPS_CERT_FILE || './localhost.pem',
  sentryDSN: import.meta.env.SERVER_SENTRY_DSN,
  release: import.meta.env.RELEASE,
  environment: import.meta.env.ENVIRONMENT,
};
export default config;
