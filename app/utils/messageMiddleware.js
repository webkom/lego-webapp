import { get } from 'lodash';

export default function createMessageMiddleware(actionToDispatch, Sentry) {
  return store => next => action => {
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
}
