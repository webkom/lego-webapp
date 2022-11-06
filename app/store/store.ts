import { GetCookie, SentryType } from 'app/types';
import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory, createMemoryHistory } from 'history';
import type { History } from 'history';
import createRootReducer, { RootState } from 'app/store/rootReducer';
import { routerMiddleware } from 'connected-react-router';
import promiseMiddleware from 'app/store/middleware/promiseMiddleware';
import createMessageMiddleware from 'app/store/middleware/messageMiddleware';
import { addToast } from 'app/actions/ToastActions';
import createSentryMiddleware from 'redux-sentry-middleware';
import loggerMiddleware from 'app/store/middleware/loggerMiddleware';

export const history: History = __CLIENT__
  ? createBrowserHistory()
  : createMemoryHistory();

const createStore = (
  initialState = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: SentryType;
    getCookie?: GetCookie;
  } = {}
) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer: createRootReducer(history),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            getCookie,
          },
        },
      })
        .prepend(promiseMiddleware())
        .concat(
          [
            routerMiddleware(history),
            createMessageMiddleware(
              (message) =>
                addToast({
                  message,
                }),
              Sentry
            ),
            Sentry && createSentryMiddleware(Sentry),
            __CLIENT__ &&
              require('app/store/middleware/websocketMiddleware').default(),
            __CLIENT__ && __DEV__ && loggerMiddleware,
          ].filter(Boolean)
        ),
  });

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextReducer = require('./rootReducer').default;

      store.replaceReducer(nextReducer(history));
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];

export interface AsyncThunkConfig {
  state: RootState;
  dispatch: AppDispatch;
}
