import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RouterState as ConnectedReactRouterState } from 'connected-react-router';

export interface RouterState extends ConnectedReactRouterState {
  statusCode?: number;
}

const initialState: RouterState = {
  action: undefined,
  location: undefined,
  statusCode: null,
};

const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    setStatusCode: (state, action: PayloadAction<number>) => {
      state.statusCode = action.payload;
    },
  },
});

export const { setStatusCode } = routerSlice.actions;
export default routerSlice.reducer;
