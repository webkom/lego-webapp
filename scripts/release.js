#!/usr/bin/env node
/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const meow = require('meow');
const exec = require('child-process-promise').exec;


const assets = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'dist', 'webpack-assets.json'))
);

const { app, vendor } = assets;

const release = process.env.RELEASE;
const sentryProject = 'webkom/lego-web';
const sentryAuthKey = process.env.SENTRY_AUTH_KEY;
const appSourceMap = `./dist${app.js}.map`;
const vendorSourceMap = `./dist${vendor.js}.map`;
const serverSourceMap = './dist/server.js.map';

const failedCommands = [];

const cli = meow(`
  Upload artifacts to sentry and create a release.
`);

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

/**
 *
 */
async function createSentryRelease(version, project) {
  return run(
    `curl https://sentry.abakus.no/api/0/projects/${project}/releases/ \
    -H 'Authorization: Bearer ${sentryAuthKey}' \
    -X POST -d '{"version": "${version}"}' -H 'Content-Type: application/json'`
  );
}

/**
 *
 */
async function uploadArtifactsToSentry(version, project) {
  return Promise.all([
    run(`
      curl https://sentry.abakus.no/api/0/projects/${project}/releases/${version}/files/ -X POST \
      -H 'Authorization: Bearer ${sentryAuthKey}' \
      -F file=@${appSourceMap} -F name=~${app.js}.map
    `),
    run(`
      curl https://sentry.abakus.no/api/0/projects/${project}/releases/${version}/files/ -X POST \
      -H 'Authorization: Bearer ${sentryAuthKey}' \
      -F file=@${vendorSourceMap} -F name=~${vendor.js}.map
    `),
    run(`
      curl https://sentry.abakus.no/api/0/projects/${project}/releases/${version}/files/ -X POST \
      -H 'Authorization: Bearer ${sentryAuthKey}' \
      -F file=@${serverSourceMap} -F name=~/server.js.map
    `)
  ]);
}

async function uploadProjectToSentry(version, project) {
  await Promise.all([
    createSentryRelease(version, project),
  ]);
  return uploadArtifactsToSentry(version, project);
}

async function deleteSourceMaps() {
  return Promise.all([
    run(`rm ${appSourceMap}`),
    run(`rm ${vendorSourceMap}`),
    run(`rm ${serverSourceMap}`),
  ]);
}

async function main(flags) {
  const startTime = Date.now();

  await task(uploadProjectToSentry(release, sentryProject));

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
