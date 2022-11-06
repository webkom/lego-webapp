import { get } from 'lodash';
import type { AnyAction, Middleware } from '@reduxjs/toolkit';
import { RootState } from 'app/store/rootReducer';
import { SentryType } from 'app/types';

const createMessageMiddleware =
  (
    actionToDispatch: (message: string) => AnyAction,
    Sentry: SentryType
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Middleware<{}, RootState> =>
  (store) =>
  (next) =>
  (action) => {
    const success = action.success && get(action, ['meta', 'successMessage']);
    const error = action.error && get(action, ['meta', 'errorMessage']);

    if (!(success || error)) {
      return next(action);
    }

    let message;

    if (error) {
      message = typeof error === 'function' ? error(action.error) : error;
      Sentry.captureException(action.payload);
    } else {
      message = success;
    }

    if (actionToDispatch) {
      store.dispatch(actionToDispatch(message));
    }

    return next(action);
  };

export default createMessageMiddleware;
