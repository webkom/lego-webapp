// @flow

import { Toasts } from '../actions/ActionTypes';
import produce from 'immer';

type Toast = {
  id: number,
  message: string,
  removed: boolean
};

const initialState = {
  items: []
};

type State = {
  items: Array<Toast>
};

const toasts = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Toasts.TOAST_ADDED:
      newState.items.push(action.payload);
      break;

    case Toasts.TOAST_REMOVED: {
      const toast = newState.items.find(t => t.id == action.payload.id);
      if (toast) {
        toast.removed = true;
      }
      break;
    }
  }
}, initialState);

export default toasts;
