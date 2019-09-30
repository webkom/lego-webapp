// @flow

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
  users: false
};

// export type Allowed = {
//   [$Keys<typeof initialState>]: boolean
// };

export type Allowed = $ObjMap<typeof initialState, <V>(v: any) => boolean>;

export default function allowed(state: Allowed = initialState, action: any) {
  switch (action.type) {
    case Meta.FETCH.SUCCESS:
      return action.payload.isAllowed;
    default:
      return state;
  }
}
