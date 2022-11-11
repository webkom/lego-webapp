import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ID } from 'app/store/models';
import type { RootState } from 'app/store/rootReducer';
import type { NotificationProps } from 'react-notification';

interface Toast extends NotificationProps {
  id: ID;
  removed: boolean;
}

export interface ToastState {
  items: Toast[];
}

const initialState: ToastState = {
  items: [],
};

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (
      state,
      action: PayloadAction<Omit<Toast, 'id' | 'removed'> & { id?: ID }>
    ) => {
      state.items.push({
        // Unsure how to best generate a new id here? Should it be a large random
        // number, or just an increment of the current max id?
        id: Date.now() + Math.round(Math.random() * 1000),
        removed: false,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<ID>) => {
      const toast = state.items.find((t) => t.id === action.payload);
      if (toast) {
        toast.removed = true;
      }
    },
  },
});

export default toastsSlice.reducer;
export const { addToast, removeToast } = toastsSlice.actions;

export const selectToasts = (state: RootState) =>
  state.toasts.items.filter((toast) => !toast.removed);
