import { configureStore } from '@reduxjs/toolkit';
import { createRootReducer, RootState } from './rootReducer';

export type GetCookie = (cookie: string) => string | null | undefined;

const createStore = (
  initialState: RootState | Record<string, never> = {},
  {
    getCookie,
  }: {
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
      }),
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./rootReducer', async () => {
      const { createRootReducer } = await import('./rootReducer');

      store.replaceReducer(createRootReducer());
    });
  }

  return store;
};

export default createStore;

export type Store = ReturnType<typeof createStore>;
export type AppDispatch = Store['dispatch'];
