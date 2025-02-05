import { Transform } from 'stream';
import * as Sentry from '@sentry/node';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import {
  createStaticHandler,
  createStaticRouter,
  type StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom/server';
import {
  ChunkCollectorContext,
  createChunkCollector,
  preloadAll,
} from 'vite-preload';
import routerConfig from 'app/routes';
import createStore from 'app/store/createStore';
import { prepareWithTimeout } from '../server/prepareWithTimeout';
import {
  populateTemplateHead,
  populateTemplateTail,
} from '../server/renderHtml';
import createFetchRequest from '../server/request';
import type { Request, Response } from 'express';
import type { HelmetServerState } from 'react-helmet-async/lib/types';

export async function render(req: Request, res: Response, template: string) {
  const log = req.app.get('log');

  const helmetContext = {} as { helmet?: HelmetServerState };
  const store = createStore(
    {},
    {
      Sentry,
      getCookie: (key) => req.cookies[key],
    },
  );

  const { query, dataRoutes } = createStaticHandler(routerConfig);
  const fetchRequest = createFetchRequest(req, res);
  const context = (await query(fetchRequest)) as StaticHandlerContext;
  const router = createStaticRouter(dataRoutes, context);

  const reportError = (error: unknown) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const err = error.error ? error.payload : error;
      log.error(err, 'render_error');
      Sentry.captureException(err);
    } catch (e) {
      //
    }
  };

  const collector = createChunkCollector({
    manifest: './dist/client/.vite/manifest.json',
    entry: 'index.html',
  });

  const App = () => (
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>
    </HelmetProvider>
  );
  console.log('created app element');

  // Run react-prepare hooks to fetch ssr redux data
  let preparedStateCode = '';
  try {
    preparedStateCode = await prepareWithTimeout(<App />);
  } catch (error) {
    console.log(error);
    reportError(error);
  }
  const statusCode = store.getState().router.statusCode || 200;
  console.log('prepared', preparedStateCode);

  // Preload loadable/lazy components so that they are ready when SSR is rendering
  await preloadAll();
  console.log('preloaded');

  // // Not gonna work locally in Chrome unless you have a HTTP/2 supported proxy in front, use Firefox to pick up 103 Early Hints over HTTP/1.1 without TLS
  // // https://developer.chrome.com/docs/web-platform/early-hints
  // // Also services like cloudflare already handles this for you
  // // https://developers.cloudflare.com/cache/advanced-configuration/early-hints/
  // if (req.headers['sec-fetch-mode'] === 'navigate') {
  //   res.writeEarlyHints({
  //     link: collector.getLinkHeaders(),
  //   });
  //   await setTimeout(1000);
  // }

  const [head, tail] = template.split('<!--app-body-->');

  const { pipe } = renderToPipeableStream(
    <ChunkCollectorContext collector={collector}>
      <App />
    </ChunkCollectorContext>,
    {
      onAllReady: () => {
        console.log('pipe ready');

        const linkTags = collector.getTags();
        console.log(linkTags);
        const linkHeaders = collector.getLinkHeaders();

        // The link header below now contains
        res.writeHead(statusCode, {
          'content-type': 'text/html',
          link: linkHeaders,
        });

        // Inject <link rel=modulepreload> and <link rel=stylesheet> in the head. Without this the CSS for any lazy component would be loaded after the app has and cause a Flash of Unstyled Content (FOUC).
        res.write(
          populateTemplateHead(head, {
            helmet: helmetContext.helmet,
            reduxState: store.getState(),
          }).replace('</head>', `${linkTags}\n</head>`),
        );

        console.log('head written');

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });

        pipe(transformStream);

        console.log('piping body');

        transformStream.on('finish', () => {
          console.log('finished piping body');
          res.end(
            populateTemplateTail(tail, {
              preparedStateCode,
              reduxState: store.getState(),
            }),
          );
          console.log('wrote tail');
        });
      },
    },
  );
}
