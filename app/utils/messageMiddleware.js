import Raven from 'raven-js';

export default function createMessageMiddleware(actionToDispatch) {
  return store => next => action => {
    if (
      !action.meta ||
      !(
        (action.success && action.meta.successMessage) ||
        (action.error && action.meta.errorMessage)
      )
    ) {
      return next(action);
    }
    let message;

    if (action.error) {
      Raven.captureException(action.payload);
      message =
        typeof action.meta.errorMessage === 'function'
          ? action.meta.errorMessage(action.error)
          : action.meta.errorMessage;
    } else {
      message = action.meta.successMessage;
    }
    store.dispatch(actionToDispatch(message));
    return next(action);
  };
}
