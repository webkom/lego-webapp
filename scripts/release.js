#!/usr/bin/env node
/* eslint no-console: 0 */
const path = require('path');
const chalk = require('chalk');
const meow = require('meow');
const exec = require('child-process-promise').exec;
const { assets } = require('../dist/stats.json');

const sourceMaps = assets
  .map(({ name }) => name)
  .filter(name => name.endsWith('.js.map'))
  .concat('server.js.map');

const { RELEASE, SENTRY_AUTH_KEY } = process.env;
const SENTRY_PROJECT = 'webkom/lego-webapp';

const failedCommands = [];

const cli = meow(`
  Upload artifacts to sentry and create a release.
`);

function getPath(filename) {
  return path.resolve(__dirname, '..', 'dist', filename);
}

async function run(command) {
  try {
    console.log(chalk.yellow('RUN'), command);
    return await exec(command);
  } catch (error) {
    console.error(error);
    throw new Error(command);
  }
}

async function task(promise) {
  try {
    await promise;
  } catch (error) {
    failedCommands.push(error);
  }
}

async function createSentryRelease(version, project) {
  return run(
    `curl https://sentry.abakus.no/api/0/projects/${SENTRY_PROJECT}/releases/ \
    -H 'Authorization: Bearer ${SENTRY_AUTH_KEY}' \
    -X POST -d '{"version": "${RELEASE}"}' -H 'Content-Type: application/json'`
  );
}

async function uploadSourceMap(filename) {
  const result = await run(`
    curl https://sentry.abakus.no/api/0/projects/${SENTRY_PROJECT}/releases/${RELEASE}/files/ -X POST \
    -H 'Authorization: Bearer ${SENTRY_AUTH_KEY}' \
    -F file=@${getPath(filename)} -F name=~/${filename}
  `);

  if (!JSON.parse(result.stdout).sha1) {
    throw new Error(`Upload error ${result.stdout}`);
  }

  return result;
}

async function uploadProjectToSentry() {
  await createSentryRelease();
  await Promise.all(sourceMaps.map(uploadSourceMap));
}

async function deleteSourceMaps() {
  await Promise.all(
    sourceMaps.map(sourceMap => run(`rm ${getPath(sourceMap)}`))
  );
}

async function main(flags) {
  const startTime = Date.now();

  await task(uploadProjectToSentry());

  if (flags.delete) {
    // Delete sourcemaps if the --delete flag exists.
    await task(deleteSourceMaps());
  }

  if (failedCommands.length > 0) {
    console.log();
    console.log(chalk.red.bold('These commands failed:'));

    for (const error of failedCommands) {
      console.error(chalk.gray('$ '), error.message);
    }

    console.log();
    console.log(chalk.yellow('Try to run them manually.'));
  } else {
    console.log(chalk.green('All good!'), '😎');
  }

  console.log(
    chalk.green(
      `Done in ${((Date.now() - startTime) / 1000).toFixed(2)} seconds.`
    )
  );
  console.log();
}

main(cli.flags);
