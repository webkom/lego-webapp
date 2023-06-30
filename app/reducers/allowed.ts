import { createSlice } from '@reduxjs/toolkit';
import { Meta } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';

const initialState = {
  events: false,
  articles: false,
  joblistings: false,
  companies: false,
  meetings: false,
  quotes: false,
  galleries: false,
  interestGroups: false,
  bdb: false,
  announcements: false,
  penalties: false,
  surveys: false,
  groups: false,
  email: false,
  users: false,
  polls: false,
};

const allowed = createSlice({
  name: 'allowed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      Meta.FETCH.SUCCESS,
      (state, action: AnyAction /* TODO(eik): Type this */) => {
        return action.payload.isAllowed;
      }
    );
  },
});

export default allowed.reducer;
