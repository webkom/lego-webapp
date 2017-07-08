import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import cookie from 'react-cookie';
import { prepare } from 'react-prepare';
import Helmet from 'react-helmet';
import routes from '../app/routes';
import configureStore from '../app/utils/configureStore';

import manifest from '../app/assets/manifest.json';
require('../app/assets/favicon.png');
require('../app/assets/icon-192x192.png');
require('../app/assets/icon-256x256.png');
require('../app/assets/icon-384x384.png');
require('../app/assets/icon-512x512.png');

function render(req, res, next) {
  cookie.plugToRequest(req, res);
  match({ routes, location: req.url }, (err, redirect, renderProps) => {
    if (err) {
      return next(err);
    }

    if (redirect) {
      return res.redirect(`${redirect.pathname}${redirect.search}`);
    }

    if (!renderProps) {
      return next();
    }

    // Todo: render on errors as well
    const store = configureStore();
    const app = (
      <Provider store={store}>
        <RouterContext {...renderProps} />
      </Provider>
    );

    const respond = () => {
      const body = renderToString(app);

      res.send(
        renderPage({
          body,
          state: store.getState(),
          helmet: Helmet.rewind()
        })
      );
    };

    prepare(app).then(respond).catch(error => {
      console.error('Error raised when preparing server rendering:', error);
      respond();
    });
  });
}

function renderPage({ body, state, helmet }) {
  const dllPlugin =
    process.env.NODE_ENV !== 'production'
      ? '<script src="/vendors.dll.js"></script>'
      : '';

  const assets = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'dist', 'webpack-assets.json'))
  );

  const { app, vendor } = assets;

  const styles = [app && app.css]
    .filter(Boolean)
    .map(css => `<link rel="stylesheet" href="${css}">`)
    .join('\n');
  const scripts = [vendor && vendor.js, app && app.js]
    .filter(Boolean)
    .map(js => `<script src="${js}"></script>`)
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${helmet.title.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link rel="manifest" href="${manifest}">
        <link rel="icon" sizes="192x192" href="/favicon.png">

        <link rel="apple-touch-icon" href="/favicon.png">
        <link rel="apple-touch-startup-image" href="/favicon.png">
        <meta name="apple-mobile-web-app-capable" content="yes">

        <meta name="theme-color" content="#f2f2f1">


        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

        ${helmet.meta.toString()}

        ${styles}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
           window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(
             /</g,
             '\\u003c'
           )}
        </script>

        <script src="https://js.stripe.com/v2/"></script>
        <script src="https://use.typekit.net/rtr2iog.js"></script>
        <script src="//cdn.iframe.ly/embed.js" async></script>
        <script>try{Typekit.load({ async: true });}catch(e){}</script>

        ${dllPlugin}
        ${scripts}
      </body>
    </html>
   `;
}

export default render;
