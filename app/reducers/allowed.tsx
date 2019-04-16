

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
  users: false,
  bdb: false,
  surveys: false
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
