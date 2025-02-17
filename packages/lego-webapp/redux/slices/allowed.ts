import { createSlice } from '@reduxjs/toolkit';
import { Meta } from '~/redux/ActionTypes';

const initialState = {
  announcements: false,
  articles: false,
  bdb: false,
  companies: false,
  email: false,
  events: false,
  forums: false,
  galleries: false,
  groups: false,
  interestGroups: false,
  joblistings: false,
  meetings: false,
  penalties: false,
  polls: false,
  quotes: false,
  surveys: false,
  users: false,
};

export type AllowedPages = typeof initialState;

const allowed = createSlice({
  name: 'allowed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      Meta.FETCH.SUCCESS,
      (_, action) => action.payload.isAllowed,
    );
  },
});

export default allowed.reducer;
