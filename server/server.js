import path from 'path';
import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import moment from 'moment-timezone';
import bunyan from 'bunyan';
import Raven from 'raven';
import cookieParser from 'cookie-parser';
import render from './render';
import config from './env';

moment.locale('nb-NO');
const app = express();

app.use(Raven.requestHandler());
app.use(cookieParser());

const log = bunyan.createLogger({
  name: 'lego-webapp',
  release: config.release,
  environment: config.environment
});

app.set('host', config.host || '0.0.0.0');
app.set('port', config.port || 3000);
app.set('log', log);

const webpackClient = require('../config/webpack.client.js');

if (process.env.NODE_ENV !== 'production') {
  const compiler = require('webpack')(webpackClient);

  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: webpackClient.output.publicPath,
      quiet: true
    })
  );

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: false
    })
  );
}

const styleguide = path.join(__dirname, '../styleguide');
if (fs.existsSync(styleguide)) {
  app.use('/styleguide', express.static(styleguide));
}

app.use(express.static(webpackClient.output.path));
app.use(
  morgan((tokens, req, res) => {
    log.info(
      {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        'content-length': tokens.res(req, res, 'content-length'),
        'response-time': tokens['response-time'](req, res)
      },
      'request'
    );
  })
);

app.use(render);

app.use((req, res) => {
  res.status(404).send({
    message: 'Not Found'
  });
});

app.use(Raven.errorHandler());

app.use((err, req, res, next) => {
  log.error(err, 'internal_error');
  res.statusCode = 500;
  res.end('Internal Error');
});

export default app;
