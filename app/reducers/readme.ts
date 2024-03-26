import { createSlice } from '@reduxjs/toolkit';
import { fetchReadmes } from 'app/actions/FrontpageActions';
import type { Readme } from 'app/models';

const readmeSlice = createSlice({
  name: 'readme',
  initialState: [] as Readme[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReadmes.fulfilled, (_, action) => action.payload);
  },
});

export default readmeSlice.reducer;
