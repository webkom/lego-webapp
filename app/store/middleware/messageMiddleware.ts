import { RootState } from 'app/store/rootReducer';
import type { AnyAction, Middleware } from '@reduxjs/toolkit';
import { isLegoApiAction } from 'app/store/utils/createLegoApiAction';

const createMessageMiddleware =
  (
    actionToDispatch: (message: string) => AnyAction,
    Sentry: any
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Middleware<{}, RootState> =>
  (store) =>
  (next) =>
  (action) => {
    if (!isLegoApiAction(action)) {
      return next(action);
    }

    const success = action.success && action.meta.successMessage;
    const error = action.error && action.meta.errorMessage;

    if (!(success || error)) {
      return next(action);
    }

    let message;

    if (error) {
      message = error;
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
