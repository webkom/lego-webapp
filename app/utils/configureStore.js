/*eslint-disable */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import type { UniversalRaven } from 'app/utils/universalRaven';
import { User } from 'app/actions/ActionTypes';
import { createTracker, EventTypes } from 'redux-segment';
import { createLogger } from 'redux-logger';
import jwtDecode from 'jwt-decode';
import config from 'app/config';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import createRavenMiddleware from 'raven-for-redux';
import { addToast } from 'app/actions/ToastActions';
import promiseMiddleware from './promiseMiddleware';
import { selectCurrentUser } from 'app/reducers/auth';
import createMessageMiddleware from './messageMiddleware';
import type { State, Store, GetCookie } from 'app/types';
import { omit } from 'lodash';

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

const ravenMiddlewareOptions = {
  stateTransformer: state => {
    try {
      const token = jwtDecode(state.auth.token);
      return {
        ...state,
        auth: {
          ...state.auth,
          token
        }
      };
    } catch (e) {
      return state;
    }
  },
  getUserContext: state => omit(selectCurrentUser(state), 'icalToken')
};

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default function configureStore(
  initialState: State | {||} = {},
  { raven, getCookie }: { raven: ?UniversalRaven, getCookie?: GetCookie } = {}
): Store {
  const messageMiddleware = createMessageMiddleware(
    message => addToast({ message }),
    raven
  );

  const middlewares = [
    routerMiddleware(browserHistory),
    thunkMiddleware.withExtraArgument({ getCookie }),
    promiseMiddleware(),
    raven && createRavenMiddleware(raven, ravenMiddlewareOptions),
    messageMiddleware,
    config.environment === 'production' && trackerMiddleware
  ].filter(Boolean);

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;
    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  const composeEnhancer =
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    require('../reducers').default,
    initialState,
    composeEnhancer(applyMiddleware(...middlewares))
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
