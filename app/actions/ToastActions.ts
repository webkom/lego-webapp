import { Toasts } from './ActionTypes';
import type { Action } from 'app/types';

export function removeToast({ id }: { id: number }): Action {
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
}: Record<string, any>): Action {
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
