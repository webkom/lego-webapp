const path = require('path');
const express = require('express');
const chalk = require('chalk');
const config = require('./webpack.config.babel.js');

const app = express();

app.set('host', process.env.HOST || '0.0.0.0');
app.set('port', process.env.PORT || 3000);

function clearConsole() {
  process.stdout.write('\x1bc');
}

const friendlySyntaxErrorLabel = 'Syntax error:';
const isLikelyASyntaxError = (message) => message.indexOf(friendlySyntaxErrorLabel) !== -1;

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

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


  The app is running at ${chalk.blue(`http://localhost:${app.get('port')}`)}!
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
    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();

    if (!hasErrors && !hasWarnings) {
      printMessage(chalk.green(`Assets compiled successfully in ${stats.endTime - stats.startTime} ms :-)`));
      return;
    }

    const json = stats.toJson();

    const formattedErrors = json.errors.map(
      (message) => `Error in ${formatMessage(message)}`
    );

    const formattedWarnings = json.warnings.map(
      (message) => `Warning in ${formatMessage(message)}`
    );

    if (hasErrors) {
      printMessage(chalk.red('Failed to compile assets :-('));
      formattedErrors.forEach((message) => {
        console.log(message);
        console.log();
      });
      return;
    }

    if (hasWarnings) {
      printMessage(chalk.yellow('Compiled assets with warnings :/'));
      formattedWarnings.forEach((message) => {
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
