import fs from 'fs';
import path from 'path';
import * as Sentry from '@sentry/node';
import bunyan from 'bunyan';
import bunyanPretty from 'bunyan-pretty';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressStaticGzip from 'express-static-gzip';
import moment from 'moment-timezone';
import morgan from 'morgan';
import baseConfig from 'config/env';
import config from './env';
import healthCheck from './health';
import render from './render';

moment.locale('nb-NO');
const app = express();
app.use(cookieParser());
const log = bunyan.createLogger({
  name: 'lego-webapp',
  release: config.release,
  stream: process.stdout.isTTY ? bunyanPretty() : process.stdout,
  environment: config.environment,
});
app.set('host', config.host || '0.0.0.0');
app.set('port', config.port || 3000);
app.set('log', log);

const webpackClient = require('../config/webpack.client.js');

if (__DEV__) {
  const compiler = require('webpack')(
    webpackClient(undefined, {
      mode: 'development',
    }),
  );

  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackClient.publicPath,
    }),
  );
  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: (info) => console.info(`\x1b[2m\x1b[34m[HMR] \x1b[37m${info}`),
    }),
  );
}

app.get('/healthz', healthCheck);
const styleguide = path.join(__dirname, '../styleguide');

if (fs.existsSync(styleguide)) {
  app.use('/styleguide', express.static(styleguide));
}

app.use(
  expressStaticGzip(webpackClient.outputPath, {
    index: false,
  }),
);
app.use(
  morgan((tokens, req, res) => {
    log.info(
      {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        'content-length': tokens.res(req, res, 'content-length'),
        'response-time': tokens['response-time'](req, res),
      },
      'request',
    );
  }),
);
app.get('/_config', (_, res) => res.json(baseConfig));
app.use(render);
app.use((req, res) => {
  res.status(404).send({
    message: 'Not Found',
  });
});
Sentry.setupExpressErrorHandler(app);
// Express uses number of args to determine if this is an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  log.error(err, 'internal_error');
  res.statusCode = 500;
  res.end('Internal Error');
});

export default app;
