import { configureStore, Tuple } from '@reduxjs/toolkit';
import { addToast } from 'app/reducers/toasts';
import createRootReducer from 'app/store/createRootReducer';
import loggerMiddleware from 'app/store/middleware/loggerMiddleware';
import createMessageMiddleware from 'app/store/middleware/messageMiddleware';
import promiseMiddleware from 'app/store/middleware/promiseMiddleware';
import sentryReduxEnhancer from 'app/store/middleware/sentryEnhancer';
import createWebSocketMiddleware from 'app/store/middleware/websocketMiddleware';
import { isTruthy } from 'app/utils';
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
        thunk: {
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
            createMessageMiddleware((message) => addToast(message), Sentry),
            !import.meta.env.SSR && createWebSocketMiddleware(),
            !import.meta.env.SSR && import.meta.env.DEV && loggerMiddleware,
          ).filter(isTruthy),
        ),
    enhancers: (getDefaultEnhancers) => {
      return Sentry
        ? getDefaultEnhancers().concat(sentryReduxEnhancer)
        : getDefaultEnhancers();
    },
  });

  if (import.meta.hot) {
    import.meta.hot.accept('app/store/createRootReducer', (mod) => {
      const nextReducer = mod?.default;
      store.replaceReducer(nextReducer());
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
