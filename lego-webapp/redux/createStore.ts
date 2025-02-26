import { configureStore, Tuple } from '@reduxjs/toolkit';
import loggerMiddleware from '~/redux/middlewares/loggerMiddleware';
import createMessageMiddleware from '~/redux/middlewares/messageMiddleware';
import promiseMiddleware from '~/redux/middlewares/promiseMiddleware';
import createSentryReduxEnhancer from '~/redux/middlewares/sentryEnhancer';
import createWebSocketMiddleware from '~/redux/middlewares/websocketMiddleware';
import { addToast } from '~/redux/slices/toasts';
import { isTruthy } from '~/utils';
import { createRootReducer, RootState } from './rootReducer';
import type * as SentryServer from '@sentry/node';
import type * as SentryClient from '@sentry/react';

export type GetCookie = (cookie: string) => string | null | undefined;
export type SentryType = typeof SentryServer | typeof SentryClient;

const createStore = (
  initialState: RootState | Record<string, never> = {},
  {
    Sentry,
    getCookie,
  }: {
    Sentry?: SentryType;
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
        ? getDefaultEnhancers().concat(createSentryReduxEnhancer)
        : getDefaultEnhancers();
    },
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./rootReducer', (mod) => {
      const nextReducer = mod?.default;
      store.replaceReducer(nextReducer());
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
