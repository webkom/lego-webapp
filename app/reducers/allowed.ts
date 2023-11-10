import { Meta } from '../actions/ActionTypes';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';

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

const allowed: Reducer<typeof initialState> = (
  state = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case Meta.FETCH.SUCCESS:
      return action.payload.isAllowed;

    default:
      return state;
  }
};

export default allowed;
