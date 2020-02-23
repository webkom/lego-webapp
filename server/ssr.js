//@flow
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import RouteConfig from '../app/routes';
// $FlowFixMe
import { ReactReduxContext } from 'react-redux';
import Helmet from 'react-helmet';
import Raven from 'raven';
import configureStore from '../app/utils/configureStore';
import type { $Request, $Response, Middleware } from 'express';
import { createNewRavenInstance } from '../app/utils/universalRaven';
import { type State } from '../app/types';
import pageRenderer from './pageRenderer';
import { prepare } from '@webkom/react-prepare';

const serverSideTimeoutInMs = 4000;

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

const createServerSideRenderer = (
  req: $Request,
  res: $Response,
  next: Middleware
) => {
  const render = (
    body: string = '',
    state: State | {||} = Object.freeze({})
  ) => {
    const helmet = Helmet.rewind();
    return res.send(
      pageRenderer({
        body,
        state,
        helmet
      })
    );
  };

  const context = {};

  const log = req.app.get('log');

  const ServerConfig = ({
    req,
    context
  }: {
    req: $Request,
    context: { status?: string, url?: ?string, [any]: any }
  }) => (
    <StaticRouter location={req.url} context={context}>
      <RouteConfig />
    </StaticRouter>
  );

  const raven = createNewRavenInstance(Raven);

  const store = configureStore(
    {},
    { raven, getCookie: key => req.cookies[key] }
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
    <ReactReduxContext.Provider value={providerData}>
      <ServerConfig req={req} context={context} />
    </ReactReduxContext.Provider>
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
    if (context.url) {
      return res.redirect(302, context.url);
    }
    const state: State = store.getState();
    const body = renderToString(app);
    // $FlowFixMe
    const statusCode = state.router.statusCode || 200;
    res.status(statusCode);
    return render(body, state);
  };

  prepareWithTimeout(app)
    .then(
      () => respond(),
      error => {
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
    .catch(error => {
      reportError(error);
      render();
    })
    .then(unsubscribe);
  //old
  /*
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
      .catch(error => {
        reportError(error);
        render();
      });
  });
  */
};
export default createServerSideRenderer;
