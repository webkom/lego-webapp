/* eslint-disable no-console */

import http from 'http';
import app from './server';
import Raven from 'raven';
import config from './env';

Raven.config(config.ravenDsn, {
  release: config.release,
  environment: config.environment
}).install();

const server = http.createServer(app);
let currentApp = app;
const log = app.get('log');

app.listen(app.get('port'), app.get('host'), err => {
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
