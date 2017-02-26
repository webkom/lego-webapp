// @flow

import { createSelector } from 'reselect';
import { User } from '../actions/ActionTypes';
import type { Action } from '../actions/ActionTypes';

type State = {
  username: ?string;
  token: ?string;
  loginFailed: boolean;
  loggingIn: boolean;
};

const initialState = {
  username: null,
  token: null,
  loginFailed: false,
  loggingIn: false
};

export default function auth(state: State = initialState, action: Action): State {
  switch (action.type) {
    case User.LOGIN.BEGIN:
      return {
        ...state,
        loggingIn: true,
        loginFailed: false
      };

    case User.LOGIN.FAILURE:
      return {
        ...state,
        loggingIn: false,
        loginFailed: true
      };

    case User.LOGIN.SUCCESS:
      return {
        ...state,
        loggingIn: false,
        token: action.payload.token
      };

    case User.FETCH.SUCCESS:
      if (!action.meta.isCurrentUser) {
        return state;
      }

      return {
        ...state,
        username: action.payload.result
      };

    case User.LOGOUT:
      return initialState;

    default:
      return state;
  }
}

export function selectIsLoggedIn(state: any) {
  return state.auth.token !== null;
}

export const selectCurrentUser = createSelector(
  (state) => state.users.byId,
  (state) => state.auth.username,
  (usersById, userId) => usersById[userId] || {}
);
