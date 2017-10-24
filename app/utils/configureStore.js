// @flow

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { User } from 'app/actions/ActionTypes';
import { createTracker, EventTypes } from 'redux-segment';
import { createLogger } from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';
import { addNotification } from 'app/actions/NotificationActions';
import promiseMiddleware from './promiseMiddleware';
import createMessageMiddleware from './messageMiddleware';
import type { State, Store } from 'app/types';
import config from 'app/config';

const trackerMiddleware = createTracker({
  mapper: {
    [User.FETCH.SUCCESS]: (getState, { meta, payload }) => {
      if (meta.isCurrentUser) {
        const user = payload.entities.users[payload.result];

        return {
          eventType: EventTypes.identify,
          eventPayload: {
            userId: user.id,
            traits: {
              avatar: user.profilePicture,
              email: user.email,
              firstName: user.firstName,
              gender: user.gender,
              id: user.id,
              lastName: user.lastName,
              name: user.fullName,
              username: user.username
            }
          }
        };
      }
    },
    [User.LOGOUT]: () => [
      {
        eventType: EventTypes.reset
      },
      {
        eventType: EventTypes.page
      }
    ]
  }
});

Raven.config(config.ravenDSN, {
  release: config.release,
  environment: config.environment
}).install();

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

const messageMiddleware = createMessageMiddleware(message =>
  addNotification({ message })
);

export default function configureStore(initialState: State): Store {
  const middlewares = [
    routerMiddleware(browserHistory),
    thunkMiddleware,
    promiseMiddleware(),
    createRavenMiddleware(Raven),
    messageMiddleware,
    trackerMiddleware
  ];

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;
    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  // $FlowFixMe
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
