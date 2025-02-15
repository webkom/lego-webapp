import { configureStore, Tuple } from '@reduxjs/toolkit';
import { addToast } from 'app/reducers/toasts';
import createRootReducer from 'app/store/createRootReducer';
import createMessageMiddleware from 'app/store/middleware/messageMiddleware';
import promiseMiddleware from 'app/store/middleware/promiseMiddleware';
import sentryReduxEnhancer from 'app/store/middleware/sentryEnhancer';
import createWebSocketMiddleware from 'app/store/middleware/websocketMiddleware.client';
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
            createMessageMiddleware(
              (content: ToastContent) => addToast(content),
              Sentry,
            ),
            !import.meta.env.SSR && createWebSocketMiddleware(),
          ).filter(isTruthy),
        ),
    enhancers: (getDefaultEnhancers) => {
      return Sentry
        ? getDefaultEnhancers().concat(sentryReduxEnhancer)
        : getDefaultEnhancers();
    },
  });

  if (import.meta.hot) {
    import.meta.hot.accept('app/store/createRootReducer', () => {
      const nextReducer = require('app/store/createRootReducer').default;

      store.replaceReducer(nextReducer());
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
