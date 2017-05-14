// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';
import { addNotification } from 'app/actions/NotificationActions';
import promiseMiddleware from './promiseMiddleware';
import createErrorMiddleware from './errorMiddleware';
import type { State, Store } from 'app/types';
import config from 'app/config';

Raven.config(config.ravenDSN, {
  release: config.RELEASE
}).install();

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const errorMiddleware = createErrorMiddleware(message =>
  addNotification({ message })
);

export default function configureStore(initialState: State): Store {
  const middlewares = [
    routerMiddleware(browserHistory),
    thunkMiddleware,
    promiseMiddleware,
    createRavenMiddleware(Raven),
    errorMiddleware
  ];

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;
    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  const store = createStore(
    require('../reducers').default,
    initialState,
    compose(
      applyMiddleware(...middlewares),
      global.devToolsExtension ? global.devToolsExtension() : f => f
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
