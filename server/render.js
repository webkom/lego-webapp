//@flow
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
import type { $Request, $Response, Middleware } from 'express';
import { createNewRavenInstance } from '../app/utils/universalRaven';
import webpackClient from '../config/webpack.client.js';
import type { State } from '../app/types';

import 'source-map-support/register';

import manifest from '../app/assets/manifest.json';

const serverSideTimeoutInMs = 4000;

// AntiPattern because of babel
// https://github.com/babel/babel/issues/3083
class TimeoutError {
  error: Error;
  constructor(msg) {
    this.error = new Error(msg);
  }
}

const prepareWithTimeout = app =>
  Promise.race([
    prepare(app),
    new Promise(resolve => {
      setTimeout(resolve, serverSideTimeoutInMs);
    }).then(() => {
      throw new TimeoutError(
        'React prepare timeout when server side rendering.'
      );
    })
  ]);

function render(req: $Request, res: $Response, next: Middleware) {
  const render = (
    body: string = '',
    state: State | {||} = Object.freeze({})
  ) => {
    const helmet = Helmet.rewind();
    return res.send(
      renderPage({
        body,
        state,
        helmet
      })
    );
  };

  const log = req.app.get('log');

  if (__DEV__) {
    return render();
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

    const createElement = (Component, props) => <Component {...props} />;

    const raven = createNewRavenInstance(Raven);

    const store = configureStore(
      {},
      { raven, getCookie: key => req.cookies[key] }
    );
    const app = (
      <Provider store={store}>
        <RouterContext {...renderProps} createElement={createElement} />
      </Provider>
    );

    const reportError = (error: Error) => {
      try {
        // $FlowFixMe
        const err = error.error ? error.payload : error;
        log.error(err, 'render_error');
        raven.captureException(err);
      } catch (e) {
        //
      }
    };

    const respond = () => {
      const state: State = store.getState();
      const body = renderToString(app);
      // $FlowFixMe
      const statusCode = state.routing.statusCode || 200;
      res.status(statusCode);
      return render(body, state);
    };

    prepareWithTimeout(app)
      .then(
        () => respond(),
        error => {
          if (error instanceof TimeoutError) {
            reportError(error.error);
            return render();
          }
          reportError(error);
          respond();
        }
      )
      .catch(error => {
        reportError(error);
        render();
      });
  });
}

let cachedAssets;
function retrieveAssets() {
  if (__DEV__ || !cachedAssets) {
    const { app, 'vendors~app': vendor, styles: appStyles } = JSON.parse(
      fs
        .readFileSync(
          path.join(webpackClient.outputPath, 'webpack-assets.json')
        )
        .toString()
    );

    const styles = [appStyles && appStyles.css]
      .filter(Boolean)
      .map(css => `<link rel="stylesheet" href="${css}">`)
      .join('\n');
    const scripts = [
      vendor && vendor.js,
      app && app.js,
      appStyles && appStyles.js
    ]
      .filter(Boolean)
      .map(js => `<script src="${js}"></script>`)
      .join('\n');

    cachedAssets = { scripts, styles };
  }

  return cachedAssets;
}

const dllPlugin = __DEV__ ? '<script src="/vendors.dll.js"></script>' : '';

function renderPage({
  body,
  state,
  helmet
}: {
  body: string,
  state: State | {||},
  helmet: *
}) {
  const { scripts, styles } = retrieveAssets();
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${helmet.title.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <meta name="theme-color" content="#f2f2f1">
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Abakus Søk">
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
        <link rel="manifest" href="${manifest}">

        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="Abakus"/>

        <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
        <link href="https://unpkg.com/ionicons@3.0.0/dist/css/ionicons.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Cardo|Raleway|Roboto" rel="stylesheet">

        ${helmet.meta.toString()}

        ${styles}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
           window.__CONFIG__ = ${serialize(config, { isJSON: true })};
           window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};
        </script>
        ${
          config.environment === 'production'
            ? `<script>

  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
          analytics.load("${config.segmentWriteKey}");
          }}();
      </script>`
            : ''
        }
        <script async src="https://js.stripe.com/v2/"></script>
        <script async src="https://js.stripe.com/v3/"></script>
        ${dllPlugin}
        ${scripts}
      </body>
    </html>
   `;
}

export default render;
