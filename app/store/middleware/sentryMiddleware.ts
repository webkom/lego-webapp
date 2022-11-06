import createSentryMiddleware from 'redux-sentry-middleware';
import jwtDecode from 'jwt-decode';
import { omit } from 'lodash';
import { selectCurrentUser } from 'app/reducers/auth';
import { RootState } from 'app/store/rootReducer';

const sentryMiddlewareOptions: createSentryMiddleware.Options<RootState> = {
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

// TODO: Remove any
const create = (Sentry: any) =>
  createSentryMiddleware(Sentry, sentryMiddlewareOptions);

export default create;
