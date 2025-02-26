import * as Sentry from '@sentry/react';
import { jwtDecode } from 'jwt-decode';
import type { RootState } from '~/redux/rootReducer';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  stateTransformer: (state: RootState) => {
    try {
      const token = state.auth.token ? jwtDecode(state.auth.token) : undefined;
      return { ...state, auth: { ...state.auth, token } };
    } catch (_) {
      return state;
    }
  },
});

export default sentryReduxEnhancer;
