// @flow

import { User } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export type UserEntity = {
  username: string
};

export default createEntityReducer({
  key: 'users',
  types: {
    fetch: User.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case User.CONFIRM_STUDENT_USER.SUCCESS: {
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.username]: action.payload
          }
        };
      }
      default:
        return state;
    }
  }
});
