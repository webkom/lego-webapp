import { createSlice } from '@reduxjs/toolkit';
import { Readme } from 'app/actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';
import type { Readme as ReadmeType } from 'app/models';

const readmeSlice = createSlice({
  name: 'readme',
  initialState: [] as ReadmeType[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(Readme.FETCH.SUCCESS, (_, action: AnyAction) => {
      return action.payload;
    });
  },
});

export default readmeSlice.reducer;
