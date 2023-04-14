import { createSelector } from 'reselect';
import type { RootState } from 'app/store/createRootReducer';
import { User } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';

type State = {
  id: number | null;
  username: string | null;
  token: string | null;
  loginFailed: boolean;
  loggingIn: boolean;
  registrationToken: string | null;
  studentConfirmed: boolean | null;
};

const initialState: State = {
  username: null,
  id: null,
  token: null,
  loginFailed: false,
  loggingIn: false,
  registrationToken: null,
  studentConfirmed: null,
};
export default function auth(
  state: State = initialState,
  action: AnyAction
): State {
  switch (action.type) {
    case User.LOGIN.BEGIN:
      return { ...state, loggingIn: true, loginFailed: false };

    case User.LOGIN.FAILURE:
      return { ...state, loggingIn: false, loginFailed: true };

    case User.CREATE_USER.SUCCESS:
    case User.LOGIN.SUCCESS:
    case User.REFRESH_TOKEN.SUCCESS:
      return {
        ...state,
        loggingIn: false,
        token: action.payload.token,
        registrationToken: null,
      };

    case User.FETCH.SUCCESS:
      if (!action.meta.isCurrentUser) {
        return state;
      }

      return {
        ...state,
        id: action.payload.result,
        username: action.payload.entities.users[action.payload.result].username,
      };

    case User.LOGOUT:
      return initialState;

    case User.VALIDATE_REGISTRATION_TOKEN.SUCCESS:
      return { ...state, registrationToken: action.meta.token };

    case User.CONFIRM_STUDENT_USER.FAILURE:
      return { ...state, studentConfirmed: false };

    case User.CONFIRM_STUDENT_USER.SUCCESS:
      return { ...state, studentConfirmed: true };

    default:
      return state;
  }
}
export function selectIsLoggedIn(state: RootState) {
  return state.auth.token !== null;
}
export const selectCurrentUser = createSelector(
  (state) => state.users.byId,
  (state) => state.auth.id,
  (usersById, userId) => usersById[userId] || {}
);
