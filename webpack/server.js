const path = require('path');
const express = require('express');
const chalk = require('chalk');
const config = require('./webpack.config.babel.js');
const formatMessage = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');

const app = express();

app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 3000);

function printMessage(message) {
  clearConsole();
  console.log(`
   ___      _______  _______  _______
  |   |    |       ||       ||       |
  |   |    |    ___||    ___||   _   |
  |   |    |   |___ |   | __ |  | |  |
  |   |___ |    ___||   ||  ||  |_|  |
  |       ||   |___ |   |_| ||       |
  |_______||_______||_______||_______|


  The app is running at ${chalk.blue(`http://${app.get('host')}:${app.get('port')}`)}!
  NODE_ENV=${chalk.green(process.env.NODE_ENV)}

  ${message}
  `);
}

if (process.env.NODE_ENV !== 'production') {
  const compiler = require('webpack')(config);

  compiler.plugin('invalid', () => {
    printMessage(chalk.yellow('Compiling assets...'));
  });

  compiler.plugin('done', (stats) => {
    const messages = formatMessage(stats.toJson({}, true));
    const hasErrors = messages.errors.length;
    const hasWarnings = messages.warnings.length;

    if (!hasErrors && !hasWarnings) {
      printMessage(
        chalk.green(`Assets compiled successfully in ${stats.endTime - stats.startTime} ms :-)`)
      );
      return;
    }
    if (hasErrors) {
      printMessage(chalk.red('Failed to compile assets :-('));
      messages.errors.forEach((message) => {
        console.log(message);
        console.log();
      });
      return;
    }

    if (hasWarnings) {
      printMessage(chalk.yellow(`Compiled assets with warnings in ${stats.endTime - stats.startTime} ms :/`));
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

  app.use(express.static(config.output.path));
  app.use((req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        next(err);
        return;
      }

      res.set('Content-Type', 'text/html');
      res.send(result);
    });
  });
} else {
  app.use(express.static(config.output.path));
  app.use((req, res) => {
    res.sendFile(`${config.output.path}/index.html`);
  });
}

app.listen(app.get('port'), app.get('host'), (err) => {
  if (err) {
    console.error(err);
  } else {
    printMessage(chalk.green('Go to your browser :-)'));

    if (!process.env.NODE_ENV) {
      printMessage(
        chalk.red(`NODE_ENV is not set. Please put ${chalk.cyan('export NODE_ENV=development')} in your shell config.`) // eslint-disable-line
      );
    }
  }
});
