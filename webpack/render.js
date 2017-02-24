import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import routes from '../app/routes';
import configureStore from '../app/utils/configureStore';

function render(req, res, next) {
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
  });
}


function renderPage({ body, reduxState, helmet }) {
  const appJs = 'app.js';
  const vendorJs = process.env.NODE_ENV === 'production' ? 'vendor.js' : 'vendors.dll.js';

  const styles = [
    process.env.NODE_ENV === 'production' && 'app.css'
  ].filter(Boolean);

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

        ${styles.map((style) => `<link rel="stylesheet" href="/${style}">`)}
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
        <script src="/${vendorJs}"></script>
        <script src="/${appJs}"></script>
      </body>
    </html>
   `;
}


export default render;
