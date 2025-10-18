import { configureStore } from '@reduxjs/toolkit';
import { createRootReducer } from '~/redux/rootReducer';

const store = () =>
  configureStore({
    reducer: createRootReducer(),
    preloadedState: {
      theme: {
        theme: 'light',
      },
      auth: {
        id: 1,
        username: 'webkom',
        token: 'token',
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: true,
      },
      users: {
        ids: [],
        entities: {},
        actionGrant: ['view'],
        fetching: false,
        fetchingAchievements: false,
        paginationNext: {},
      },
      emojis: {
        ids: [],
        entities: {},
        actionGrant: ['view'],
        fetching: false,
        paginationNext: {},
      },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });

export default store;
