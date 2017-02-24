const express = require('express');
const chalk = require('chalk');
const moment = require('moment');
const formatMessage = require('react-dev-utils/formatWebpackMessages');
const render = require('./render').default;

const app = express();

moment.locale('nb-NO');

app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 3000);

const config = require('./webpack.client.js');

if (process.env.NODE_ENV !== 'production') {
  const compiler = require('webpack')(config);

  compiler.plugin('invalid', () => {
    console.error(chalk.yellow('Compiling assets...'));
  });

  compiler.plugin('done', (stats) => {
    const messages = formatMessage(stats.toJson({}, true));
    const hasErrors = messages.errors.length;
    const hasWarnings = messages.warnings.length;

    if (!hasErrors && !hasWarnings) {
      console.error(
        chalk.green(`Assets compiled successfully in ${stats.endTime - stats.startTime} ms :-)`)
      );
      return;
    }
    if (hasErrors) {
      console.error(chalk.red('Failed to compile assets :-('));
      messages.errors.forEach((message) => {
        console.log(message);
        console.log();
      });
      return;
    }

    if (hasWarnings) {
      console.error(chalk.yellow(`Compiled assets with warnings in ${stats.endTime - stats.startTime} ms :/`));
      messages.warnings.forEach((message) => {
        console.log(message);
        console.log();
      });
    }
  });

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    quiet: true
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: false
  }));
}

app.use(express.static(config.output.path));
app.use(render);

app.use((req, res) => {
  res.status(404).send({
    message: 'Not Found'
  });
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  console.error(err);
  res.status(err.status || 500).send({
    message: 'Internal Server Error'
  });
});

app.listen(app.get('port'), app.get('host'), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(chalk.green(`App is running on localhost:${app.get('port')}`));
    if (!process.env.NODE_ENV) {
      console.error(
        chalk.red(`NODE_ENV is not set. Please put ${chalk.cyan('export NODE_ENV=development')} in your shell config.`) // eslint-disable-line
      );
    }
  }
});
