import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import routes from '../app/routes';
import configureStore from '../app/utils/configureStore';

function render(req, res) {
  match({ routes, location: req.url }, (err, redirect, renderProps) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (renderProps) {
      const store = configureStore();
      const appHtml = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      res.send(renderPage(appHtml, store.getState(), Helmet.rewind()));
    } else {
      res.status(404).send('Not Found');
    }
  });
}


function renderPage(appHtml, preloadedState, helmet) {
  const appJs = 'app.js';
  const vendorJs = process.env.NODE_ENV === 'production' ? 'vendor.js' : 'vendors.dll.js';

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
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script>
           window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>

        <script src="${vendorJs}"></script>
        <script src="${appJs}"></script>
      </body>
    </html>
   `;
}


export default render;
