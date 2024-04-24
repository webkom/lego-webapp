import { configureStore, Tuple } from '@reduxjs/toolkit';
import { addToast } from 'app/reducers/toasts';
import createRootReducer from 'app/store/createRootReducer';
import loggerMiddleware from 'app/store/middleware/loggerMiddleware';
import createMessageMiddleware from 'app/store/middleware/messageMiddleware';
import promiseMiddleware from 'app/store/middleware/promiseMiddleware';
import createSentryMiddleware from 'app/store/middleware/sentryMiddleware';
import { isTruthy } from 'app/utils';
import type { ToastContent } from 'app/reducers/toasts';
import type { RootState } from 'app/store/createRootReducer';
import type { GetCookie } from 'app/types';

const createStore = (
  initialState: RootState | Record<string, never> = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: any;
    getCookie: GetCookie;
  },
) => {
  const store = configureStore({
    preloadedState: initialState,
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        fetch: {
          extraArgument: {
            getCookie,
          },
        },
        serializableCheck: {
          ignoreActions: true,
        },
      })
        .prepend(promiseMiddleware())
        .concat(
          new Tuple(
            createMessageMiddleware(
              (content: ToastContent) => addToast(content),
              Sentry,
            ),
            Sentry && createSentryMiddleware(Sentry),
            __CLIENT__ &&
              require('app/store/middleware/websocketMiddleware').default(),
            __CLIENT__ && __DEV__ && loggerMiddleware,
          ).filter(isTruthy),
        ),
  });

  if (module.hot) {
    module.hot.accept('app/store/createRootReducer', () => {
      const nextReducer = require('app/store/createRootReducer').default;

      store.replaceReducer(nextReducer());
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
