import { get } from 'lodash-es';
import type { AnyAction, Middleware } from '@reduxjs/toolkit';
import type { ToastContent } from 'app/reducers/toasts';

const createMessageMiddleware =
  (
    actionToDispatch: (content: ToastContent) => AnyAction,
    Sentry: any,
  ): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    const success = action.success && get(action, ['meta', 'successMessage']);
    const error = action.error && get(action, ['meta', 'errorMessage']);

    if (!(success || error)) {
      return next(action);
    }

    let message;
    let type;

    if (error) {
      message = typeof error === 'function' ? error(action.error) : error;
      type = 'error';
      Sentry.captureException(action.payload);
    } else {
      message = success;
      type = 'success';
    }

    if (actionToDispatch) {
      dispatch(actionToDispatch({ message, type }));
    }

    return next(action);
  };

export default createMessageMiddleware;
