import { Meta } from 'app/actions/ActionTypes';
import { createSlice } from '@reduxjs/toolkit';
import { ApiSuccessAction } from 'app/store/middleware/promiseMiddleware';

export interface AllowedState {
  events: boolean;
  articles: boolean;
  joblistings: boolean;
  companies: boolean;
  meetings: boolean;
  quotes: boolean;
  galleries: boolean;
  interestGroups: boolean;
  bdb: boolean;
  announcements: boolean;
  penalties: boolean;
  surveys: boolean;
  groups: boolean;
  email: boolean;
  users: boolean;
  polls: boolean;
}

const initialState: AllowedState = {
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

const allowedSlice = createSlice({
  name: 'allowed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      Meta.FETCH.SUCCESS,
      (_, action: ApiSuccessAction<{ isAllowed: AllowedState }>) => {
        return action.payload.isAllowed;
      }
    );
  },
});

export default allowedSlice.reducer;
