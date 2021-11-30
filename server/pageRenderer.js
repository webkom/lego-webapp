//@flow
import { renderToString } from 'react-dom/server';
import path from 'path';
import serialize from 'serialize-javascript';
import { ChunkExtractor } from '@loadable/server';
import config from '../config/env';
import webpackClient from '../config/webpack.client.js';
import type { State } from '../app/types';
import { selectCurrentUser } from 'app/reducers/auth';
import { isEmpty } from 'lodash';

import manifest from '../app/assets/manifest.json';

let cachedAssets;
function retrieveAssets(extractor) {
  if (__DEV__ || !cachedAssets) {
    const scripts = extractor.getScriptTags();
    const styles = extractor.getStyleTags();
    const links = extractor.getLinkTags();

    cachedAssets = { scripts, styles, links };
  }

  return cachedAssets;
}

const dllPlugin = __DEV__ ? '<script src="/vendors.dll.js"></script>' : '';

export type PageRendererProps = {
  app: ?React$Element<*>,
  state: State | {||},
  helmet: *,
};

export default function pageRenderer({
  app = undefined,
  state = {},
  helmet,
}: PageRendererProps = {}): string {
  const extractor = new ChunkExtractor({
    statsFile: path.join(webpackClient.outputPath, 'loadable-stats.json'),
    entrypoints: ['app'],
  });
  const collectedApp = extractor.collectChunks(app);

  const { scripts, styles, links } = retrieveAssets(extractor);
  const isSSR = app === undefined ? 'false' : 'true';

  const getDataTheme = () => {
    if (!isEmpty(state)) {
      let selectedTheme = selectCurrentUser(state).selectedTheme;
      return selectedTheme !== 'auto' ? selectedTheme : 'light';
    }
  };
  const body = renderToString(collectedApp);

  return `
    <!DOCTYPE html>
    <html data-theme=${serialize(getDataTheme() || 'light')}>
      <head>
        <meta charset="utf-8">
        ${helmet ? helmet.title.toString() : ''}
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
        ${links}

        ${helmet ? helmet.meta.toString() : ''}

        ${styles}
      </head>
      <body>
        <div id="root">${body}</div>
        <script>
           window.__CONFIG__ = ${serialize(config, { isJSON: true })};
           window.__PRELOADED_STATE__ = ${serialize(state, { isJSON: true })};
           window.__IS_SSR__ = ${isSSR};
        </script>
        <script src="https://js.stripe.com/v3/"></script>
        ${dllPlugin}
        ${scripts}
      </body>
    </html>
   `;
}
