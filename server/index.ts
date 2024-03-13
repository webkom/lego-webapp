import 'core-js/stable';
import 'regenerator-runtime/runtime';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import config from './env';
import app from './server';

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

const log = app.get('log');

server.on('error', (err) => {
  if (err) {
    log.error(err, 'could_not_start_server');
  }
});

server.listen({ port: app.get('port'), host: app.get('host') }, () => {
  log.info(
    {
      port: app.get('port'),
      host: app.get('host'),
    },
    'app_started'
  );
});
