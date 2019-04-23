export default {
  host: process.env.HOST,
  port: process.env.PORT,
  https: process.env.HTTPS || false,
  httpsCertKeyFile: process.env.HTTPS_CERT_KEY_FILE || './localhost-key.pem',
  httpsCertFile: process.env.HTTPS_CERT_FILE || './localhost.pem',
  ravenDsn: process.env.SERVER_RAVEN_DSN,
  release: process.env.RELEASE,
  environment: process.env.ENVIRONMENT
};
