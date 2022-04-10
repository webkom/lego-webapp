//@flow
import { StaticRouter } from 'react-router';
import RouteConfig from '../app/routes';
// $FlowFixMe
import { ReactReduxContext } from 'react-redux';
import * as Sentry from '@sentry/node';
import configureStore from '../app/utils/configureStore';
import { type State } from '../app/types';
import pageRenderer from './pageRenderer';
import { prepare } from '@webkom/react-prepare';
import { HelmetProvider } from 'react-helmet-async';

const serverSideTimeoutInMs = 4000;

export const helmetContext: any = {};

// AntiPattern because of babel
// https://github.com/babel/babel/issues/3083
class TimeoutError {
  error: Error;
  constructor(msg) {
    this.error = new Error(msg);
  }
}
const isTimeoutError = (error: Error) => error instanceof TimeoutError;
const isReactHooksError = (error: Object) =>
  typeof error === 'object' &&
  error.name === 'Error' &&
  error.stack.includes('Invalid hook call');

const prepareWithTimeout = (app) =>
  Promise.race([
    prepare(app),
    new Promise((resolve) => {
      setTimeout(resolve, serverSideTimeoutInMs);
    }).then(() => {
      throw new TimeoutError(
        'React prepare timeout when server side rendering.'
      );
    }),
  ]);

const createServerSideRenderer = (
  req: express$Request,
  res: express$Response,
  next: express$Middleware<express$Request, express$Response>
) => {
  const render = (
    app: ?React$Element<*> = undefined,
    state: State | {||} = Object.freeze({})
  ) => {
    return res.send(
      pageRenderer({
        app,
        state,
      })
    );
  };

  const context = {};

  const log = req.app.get('log');

  const ServerConfig = ({
    req,
    context,
  }: {
    req: express$Request,
    context: { status?: string, url?: string, [any]: any },
  }) => (
    <StaticRouter location={req.url} context={context}>
      <RouteConfig />
    </StaticRouter>
  );

  const store = configureStore(
    {},
    { Sentry, getCookie: (key) => req.cookies[key] }
  );

  const providerData = { store, storeState: store.getState() };
  const unsubscribe = store.subscribe(() => {
    const newStoreState = store.getState();
    // If the value is the same, skip the unnecessary state update.
    if (providerData.storeState === newStoreState) {
      return null;
    }
    providerData.storeState = newStoreState;
  });

  const app = (
    <HelmetProvider context={helmetContext}>
      <ReactReduxContext.Provider value={providerData}>
        <ServerConfig req={req} context={context} />
      </ReactReduxContext.Provider>
    </HelmetProvider>
  );

  const reportError = (error: Error) => {
    try {
      // $FlowFixMe
      const err = error.error ? error.payload : error;
      // $FlowFixMe
      log.error(err, 'render_error');
      Sentry.captureException(err);
    } catch (e) {
      //
    }
  };

  const respond = () => {
    if (context.url) {
      return res.redirect(302, context.url);
    }
    const state: State = store.getState();
    // TODO: remove workaround when redux-form is replaced
    state.form = {}; // Lego-editor doesn't initialize correctly when redux-form is initialized by ssr (react-prepare)
    // $FlowFixMe
    const statusCode = state.router.statusCode || 200;
    res.status(statusCode);
    return render(app, state);
  };

  prepareWithTimeout(app)
    .then(
      () => respond(),
      (error) => {
        if (isTimeoutError(error)) {
          reportError(error.error);
          return render();
        }
        if (isReactHooksError(error)) {
          return respond();
        }
        reportError(error);
        respond();
      }
    )
    .catch((error) => {
      reportError(error);
      render();
    })
    .then(unsubscribe);
};

export default createServerSideRenderer;
