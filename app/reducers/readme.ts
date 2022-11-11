import { createSlice } from '@reduxjs/toolkit';
import { fetchReadmes } from 'app/actions/FrontpageActions';

export type ReadmeState = {
  title: string;
  image: string;
  pdf: string;
  year: number;
  utgave: number;
}[];

const initialState: ReadmeState = [];

const readmeSlice = createSlice({
  name: 'readme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReadmes.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default readmeSlice.reducer;
