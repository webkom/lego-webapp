import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = '';

const test = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setTest: (_, action: PayloadAction<string>) => action.payload,
  },
});

export const { setTest } = test.actions;

export default test.reducer;
