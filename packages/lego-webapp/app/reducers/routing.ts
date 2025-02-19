import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type State = {
  statusCode: number | null;
};

const initialState: State = {
  statusCode: null,
};

const routingSlice = createSlice({
  name: 'routing',
  initialState,
  reducers: {
    setStatusCode(state, action: PayloadAction<number | null>) {
      state.statusCode = action.payload;
    },
  },
});

export default routingSlice.reducer;
export const { setStatusCode } = routingSlice.actions;
