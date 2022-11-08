import { createSlice } from '@reduxjs/toolkit';
import { fetchMeta, IsAllowedMap } from 'app/actions/MetaActions';

export type AllowedState = IsAllowedMap;

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
    builder.addCase(fetchMeta.success, (_, action) => {
      return action.payload.isAllowed;
    });
  },
});

export default allowedSlice.reducer;
