// @flow

import type { Action } from 'app/types';
import { Meta } from '../actions/ActionTypes';

const initialState = {
  companies: false,
  joblistings: false,
  meetings: false,
  quotes: false,
  galleries: false,
  announcements: false,
  groups: false,
  email: false,
  users: false
};

type State = {
  [$Keys<typeof initialState>]: boolean
};

export default function allowed(state: State = initialState, action: Action) {
  switch (action.type) {
    case Meta.FETCH.SUCCESS:
      return action.payload.isAllowed;
    default:
      return state;
  }
}
