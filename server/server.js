import express from 'express';
import moment from 'moment';
import render from './render';

const app = express();

export default app;

moment.locale('nb-NO');

app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 3000);

const config = require('../config/webpack.client.js');

if (process.env.NODE_ENV !== 'production') {
  const compiler = require('webpack')(config);

  app.use(
    require('webpack-dev-middleware')(compiler, {
      publicPath: config.output.publicPath,
      quiet: true
    })
  );

  app.use(
    require('webpack-hot-middleware')(compiler, {
      log: false
    })
  );
}

app.use(express.static(config.output.path));
app.use(render);

app.use((req, res) => {
  res.status(404).send({
    message: 'Not Found'
  });
});

app.use((err, req, res, next) => {
  // eslint-disable-line
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  console.error(err);
  res.status(err.status || 500).send({
    message: 'Internal Server Error'
  });
});
