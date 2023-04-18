import { type AnyAction } from '@reduxjs/toolkit';
import { Meta } from '../actions/ActionTypes';

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

export default function allowed(state = initialState, action: AnyAction) {
  switch (action.type) {
    case Meta.FETCH.SUCCESS:
      return action.payload.isAllowed;

    default:
      return state;
  }
}
