

import { Toasts } from '../actions/ActionTypes';
import { union } from 'lodash';

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

export default function toasts(state: State = initialState, action: any) {
  switch (action.type) {
    case Toasts.TOAST_ADDED:
      return {
        ...state,
        items: union(state.items, [action.payload])
      };

    case Toasts.TOAST_REMOVED:
      return {
        ...state,
        items: (state.items.map(toast => {
          if (toast.id === action.payload.id) {
            return { ...toast, removed: true };
          }
          return toast;
        }): Array<Toast>)
      };

    default:
      return state;
  }
}
