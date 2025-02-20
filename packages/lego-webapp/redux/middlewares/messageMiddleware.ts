import { get } from 'lodash';
import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import type { SentryType } from '~/redux/createStore';
import type { ToastContent } from '~/redux/slices/toasts';

const createMessageMiddleware =
  (
    actionToDispatch: (content: ToastContent) => UnknownAction,
    Sentry?: SentryType,
  ): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action: any) => {
    const success = action.success && get(action, ['meta', 'successMessage']);
    const error = action.error && get(action, ['meta', 'errorMessage']);

    if (!(success || error)) {
      return next(action);
    }

    let message: ToastContent['message'];
    let type: ToastContent['type'];

    if (error) {
      message = typeof error === 'function' ? error(action.error) : error;
      type = 'error';
      Sentry?.captureException(action.payload);
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
