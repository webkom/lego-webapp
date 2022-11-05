import { configureStore as configureRtkStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';
import jwtDecode from 'jwt-decode';
import { omit } from 'lodash';
import { createLogger } from 'redux-logger';
import createSentryMiddleware from 'redux-sentry-middleware';
import { addToast } from 'app/actions/ToastActions';
import { selectCurrentUser } from 'app/reducers/auth';
import type { State, Store, GetCookie } from 'app/types';
import createRootReducer from '../reducers';
import createMessageMiddleware from './messageMiddleware';
import promiseMiddleware from './promiseMiddleware';
import type { History } from 'history';

const sentryMiddlewareOptions: createSentryMiddleware.Options<any> = {
  stateTransformer: (state) => {
    try {
      const token = jwtDecode(state.auth.token);
      return { ...state, auth: { ...state.auth, token } };
    } catch (e) {
      return state;
    }
  },
  getUserContext: (state) => omit(selectCurrentUser(state), 'icalToken'),
};
const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});
export const history: History = __CLIENT__
  ? createBrowserHistory()
  : createMemoryHistory();

export default function configureStore(
  initialState: State | Record<string, never> = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: any | null | undefined;
    getCookie?: GetCookie;
  } = {}
): Store {
  const messageMiddleware = createMessageMiddleware(
    (message) =>
      addToast({
        message,
      }),
    Sentry
  );
  const middlewares = [
    routerMiddleware(history),
    promiseMiddleware(),
    Sentry && createSentryMiddleware(Sentry, sentryMiddlewareOptions),
    messageMiddleware,
  ].filter(Boolean);

  if (__CLIENT__) {
    const createWebSocketMiddleware = require('./websockets').default;
    middlewares.push(createWebSocketMiddleware());
  }

  if (__DEV__ && __CLIENT__) {
    middlewares.push(loggerMiddleware);
  }

  const store = configureRtkStore({
    reducer: createRootReducer(history),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            getCookie,
          },
        },
      }).concat(middlewares),
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
