import { createSlice, nanoid } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { PayloadAction, EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { Optional } from 'utility-types';

type Toast = {
  id: string;
  message: string;
  dismissAfter: number;
  removed: boolean;
};

const initialState = {
  items: [] as Toast[],
};
const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (
      state,
      action: PayloadAction<Optional<Toast, 'id' | 'dismissAfter' | 'removed'>>,
    ) => {
      state.items.push({
        id: nanoid(),
        dismissAfter: 5000,
        removed: false,
        ...action.payload,
      });
    },
    removeToast: (state, action: PayloadAction<EntityId>) => {
      const toast = state.items.find((t) => t.id === action.payload);

      if (toast) {
        toast.removed = true;
      }
    },
  },
});

export const { addToast, removeToast } = toastsSlice.actions;
export default toastsSlice.reducer;

export const selectToasts = createSelector(
  (state: RootState) => state.toasts.items,
  (toasts) => toasts.filter((t) => !t.removed),
);
