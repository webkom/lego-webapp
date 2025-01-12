import * as Sentry from '@sentry/node';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import {
  createStaticHandler,
  createStaticRouter,
  type StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom/server';
import routerConfig from 'app/routes';
import createStore from 'app/store/createStore';
import { prepareWithTimeout } from '../server/prepareWithTimeout';
import createFetchRequest from '../server/request';
import type { RootState } from 'app/store/createRootReducer';
import type { Request, Response } from 'express';
import type { HelmetServerState } from 'react-helmet-async/lib/types';

export async function render(req: Request, res: Response) {
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

  const app = (
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>
    </HelmetProvider>
  );

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

  let preparedStateCode = '';
  try {
    preparedStateCode = await prepareWithTimeout(app);
  } catch (error) {
    console.log(error);
    reportError(error);
  }
  const html = ReactDOMServer.renderToString(app);

  const state = store.getState() as RootState | undefined;

  return {
    reactHtml: html,
    helmet: helmetContext.helmet,
    reduxState: state,
    preparedStateCode,
  };
}
