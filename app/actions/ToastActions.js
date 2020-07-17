// @flow

import { Toasts } from './ActionTypes';

export function removeToast({ id }: { id: number }) {
  return {
    type: Toasts.TOAST_REMOVED,
    payload: {
      id,
    },
  };
}

export function addToast({
  message = 'Toast',
  action = null,
  dismissAfter = 5000,
  ...rest
}: Object) {
  return {
    type: Toasts.TOAST_ADDED,
    payload: {
      // Unsure how to best generate a new id here? Should it be a large random
      // number, or just an increment of the current max id?
      id: Date.now() + Math.round(Math.random() * 1000),
      message,
      action,
      dismissAfter,
      ...rest,
    },
  };
}
