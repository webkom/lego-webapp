import * as Sentry from '@sentry/node';
import { prepare } from '@webkom/react-prepare';
import { type ReactElement, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import createStore from 'app/store/createStore';
import { RouterConfig } from '../app/routes';
import pageRenderer from './pageRenderer';
import createFetchRequest from './request';
import type { RootState } from 'app/store/createRootReducer';
import type { Request, Response } from 'express';
import type { StaticHandlerContext} from 'react-router-dom/server';

const serverSideTimeoutInMs = 4000;
export const helmetContext = {}; // AntiPattern because of babel
// https://github.com/babel/babel/issues/3083

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

const isTimeoutError = (error: unknown): error is TimeoutError =>
  error instanceof TimeoutError;

const prepareWithTimeout = (app: ReactNode): Promise<string> =>
  Promise.race([
    prepare(app),
    new Promise((resolve) => {
      setTimeout(resolve, serverSideTimeoutInMs);
    }).then(() => {
      throw new TimeoutError(
        'React prepare timeout when server side rendering.',
      );
    }),
  ]);

const createServerSideRenderer = async (req: Request, res: Response) => {
  const render = (
    app?: ReactElement,
    state: RootState | Record<string, never> = Object.freeze({}),
    preparedStateCode?: string,
  ) => {
    return res.send(
      pageRenderer({
        app,
        state,
        preparedStateCode,
      }),
    );
  };

  const log = req.app.get('log');

  const store = createStore(
    {},
    {
      Sentry,
      getCookie: (key) => req.cookies[key],
    },
  );

  const providerData = {
    store,
    storeState: store.getState(),
  };

  const unsubscribe = store.subscribe(() => {
    const newStoreState = store.getState();

    // If the value is the same, skip the unnecessary state update.
    if (providerData.storeState === newStoreState) {
      return undefined;
    }

    providerData.storeState = newStoreState;
  });

  const { query, dataRoutes } = createStaticHandler(RouterConfig);
  const fetchRequest = createFetchRequest(req, res);
  const context = await query(fetchRequest) as StaticHandlerContext;
  const router = createStaticRouter(dataRoutes, context);

  const app = (
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>
    </HelmetProvider>
  );

  const reportError = (error: Error) => {
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

  const respond = (preparedStateCode?: string) => {
    if (context.url) {
      return res.redirect(302, context.url);
    }

    const state: RootState = store.getState();

    const statusCode = state.router.statusCode || 200;
    res.status(statusCode);
    return render(app, state, preparedStateCode);
  };

  prepareWithTimeout(app)
    .then(
      (preparedStateCode) => respond(preparedStateCode),
      (error) => {
        reportError(error);
        if (isTimeoutError(error)) {
          return render();
        }

        respond();
      },
    )
    .catch((error) => {
      reportError(error);
      render();
    })
    .then(unsubscribe);
};

export default createServerSideRenderer;
