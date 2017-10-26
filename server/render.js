import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { prepare } from '@webkom/react-prepare';
import Helmet from 'react-helmet';
import Raven from 'raven';
import serialize from 'serialize-javascript';
import routes from '../app/routes';
import configureStore from '../app/utils/configureStore';
import config from '../config/env';

import manifest from '../app/assets/manifest.json';
require('../app/assets/favicon.png');
require('../app/assets/icon-48x48.png');
require('../app/assets/icon-96x96.png');
require('../app/assets/icon-192x192.png');
require('../app/assets/icon-256x256.png');
require('../app/assets/icon-384x384.png');
require('../app/assets/icon-512x512.png');

function render(req, res, next) {
  const log = req.app.get('log');

  if (process.env.NODE_ENV !== 'production') {
    return res.send(
      renderPage({ body: '', state: {}, helmet: Helmet.rewind() })
    );
  }

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

    const createElement = (Component, props) => (
      <Component {...props} getCookie={key => req.cookies[key]} />
    );

    // Todo: render on errors as well
    const store = configureStore();
    const app = (
      <Provider store={store}>
        <RouterContext {...renderProps} createElement={createElement} />
      </Provider>
    );

    const respond = () => {
      const body = renderToString(app);

      return res.send(
        renderPage({
          body,
          state: store.getState(),
          helmet: Helmet.rewind()
        })
      );
    };

    prepare(app)
      .then(respond)
      .catch(error => {
        const err = error.error ? error.payload : error;
        log.error(err, 'render_error');
        Raven.captureException(err);
        respond();
      });
  });
}

let cachedAssets;
function retrieveAssets() {
  if (__DEV__ || !cachedAssets) {
    const { app, vendor } = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'dist', 'webpack-assets.json'))
    );

    const styles = [app && app.css]
      .filter(Boolean)
      .map(css => `<link rel="stylesheet" href="${css}">`)
      .join('\n');
    const scripts = [vendor && vendor.js, app && app.js]
      .filter(Boolean)
      .map(js => `<script src="${js}"></script>`)
      .join('\n');

    cachedAssets = { scripts, styles };
  }

  return cachedAssets;
}

const dllPlugin =
  process.env.NODE_ENV !== 'production'
    ? '<script src="/vendors.dll.js"></script>'
    : '';

function renderPage({ body, state, helmet }) {
  const { scripts, styles } = retrieveAssets();
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${helmet.title.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link rel="manifest" href="${manifest}">
        <meta name="theme-color" content="#f2f2f1">

        <link rel="icon" href="/icon-512x512.png" sizes="512x512"/>
        <link rel="apple-touch-icon" href="/icon-512x512.png" sizes="512x512"/>
        <link rel="icon" href="/icon-384x384.png" sizes="384x384"/>
        <link rel="apple-touch-icon" href="/icon-384x384.png" sizes="384x384"/>
        <link rel="icon" href="/icon-256x256.png" sizes="256x256"/>
        <link rel="apple-touch-icon" href="/icon-256x256.png" sizes="256x256"/>
        <link rel="icon" href="/icon-192x192.png" sizes="192x192"/>
        <link rel="apple-touch-icon" href="/icon-192x192.png" sizes="192x192"/>
        <link rel="icon" href="/icon-96x96.png" sizes="96x96"/>
        <link rel="apple-touch-icon" href="/icon-96x96.png" sizes="96x96"/>
        <link rel="icon" href="/icon-48x48.png" sizes="48x48"/>
        <link rel="apple-touch-icon" href="/icon-48x48.png" sizes="48x48"/>

        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Abakus"/>

        <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">

        ${helmet.meta.toString()}

        ${styles}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
           window.__CONFIG__ = ${serialize(config, { isJSON: true })};
           window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};
        </script>
        <script>
          !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"long-snoot.abakus.no/"+t+"/snoot.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
          analytics.load("${config.segmentWriteKey}");
          }}();
        </script>
        <script async src="https://js.stripe.com/v2/"></script>
        ${dllPlugin}
        ${scripts}
      </body>
    </html>
   `;
}

export default render;
