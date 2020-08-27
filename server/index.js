/* eslint-disable no-console */

import '@babel/polyfill';
import app from './server';
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';
import https from 'https';
import http from 'http';
import fs from 'fs';
import config from './env';

Sentry.init({
  dsn: config.sentryDSN,
  release: config.release,
  environment: config.environment,
  normalizeDepth: 10,
  integrations: [
    new RewriteFrames({
      root: '/app/dist/',
    }),
  ],
});

const server = config.https
  ? https.createServer(
      {
        cert: fs.readFileSync(config.httpsCertFile, 'utf8'),
        key: fs.readFileSync(config.httpsCertKeyFile, 'utf8'),
      },
      app
    )
  : http.createServer(app);
let currentApp = app;
const log = app.get('log');

server.listen(app.get('port'), app.get('host'), (err) => {
  if (err) {
    log.error(err, 'could_not_start_server');
  }
  log.info({ port: app.get('port'), host: app.get('host') }, 'app_started');
});

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
