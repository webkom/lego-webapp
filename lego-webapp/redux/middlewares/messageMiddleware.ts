import { get } from 'lodash';
import { ToastContentType } from '~/components/Toast/ToastProvider';
import type { Middleware } from '@reduxjs/toolkit';
import type { SentryType } from '~/redux/createStore';

const createMessageMiddleware =
  (
    addToast: (content: ToastContentType) => void,
    Sentry?: SentryType,
  ): Middleware =>
  () =>
  (next) =>
  (action: any) => {
    const success = action.success && get(action, ['meta', 'successMessage']);
    const error = action.error && get(action, ['meta', 'errorMessage']);

    if (!(success || error)) {
      return next(action);
    }

    let message: ToastContentType['message'];
    let type: ToastContentType['type'];

    if (error) {
      message = typeof error === 'function' ? error(action.error) : error;
      type = 'error';
      Sentry?.captureException(action.payload);
    } else {
      message = success;
      type = 'success';
    }

    if (addToast) {
      addToast({ message, type });
    }

    return next(action);
  };

export default createMessageMiddleware;
