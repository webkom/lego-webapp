// @flow

import { produce } from 'immer';

import { Toasts } from '../actions/ActionTypes';

type Toast = {
  id: number,
  message: string,
  removed: boolean,
};

const initialState = {
  items: [],
};

type State = {
  items: Array<Toast>,
};

const toasts = produce<State>((newState: State, action: any): void => {
  switch (action.type) {
    case Toasts.TOAST_ADDED:
      newState.items.push(action.payload);
      break;

    case Toasts.TOAST_REMOVED: {
      const toast = newState.items.find((t) => t.id === action.payload.id);
      if (toast) {
        toast.removed = true;
      }
      break;
    }
    default:
      break;
  }
}, initialState);

export default toasts;
