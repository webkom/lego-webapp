//@flow
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import Raven from 'raven';
import routes from '../app/routes';
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

  const log = req.app.get('log');

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
};
export default createServerSideRenderer;
