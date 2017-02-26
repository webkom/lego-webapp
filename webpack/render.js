import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import cookie from 'react-cookie';
import Helmet from 'react-helmet';
import routes from '../app/routes';
import configureStore from '../app/utils/configureStore';
import { loginAutomaticallyIfPossible } from '../app/actions/UserActions';

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

    const store = configureStore();
    store.dispatch(loginAutomaticallyIfPossible()).then(() => {
      const body = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      res.send(renderPage({
        body,
        reduxState: store.getState(),
        helmet: Helmet.rewind()
      }));
    }, (error) => console.error(error));
  });
}


function renderPage({ body, reduxState, helmet }) {
  const dllPlugin = process.env.NODE_ENV !== 'production'
    ? '<script src="/vendors.dll.js"></script>'
    : '';

  const map = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'dist', 'webpack-assets.json')));

  const assets = Object.values(map).reduce((result, chunk) => {
    chunk.css && result.css.push(chunk.css);
    chunk.js && result.js.push(chunk.js);
    return result;
  }, { js: [], css: [] });

  const styles = assets.css.map((css) => `<link rel="stylesheet" href="${css}">`).join('\n');
  const scripts = assets.js.map((js) => `<script src="${js}"></script>`).join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${helmet.title.toString()}
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <link rel="shortcut icon" href="/favicon.png" type="image/png">
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">

        ${styles}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
           window.__PRELOADED_STATE__ = ${JSON.stringify(reduxState).replace(/</g, '\\u003c')}
        </script>

        <script type="text/javascript" src="https://js.stripe.com/v2/"></script>
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
