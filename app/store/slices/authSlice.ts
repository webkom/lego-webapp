import { createSelector } from 'reselect';
import { User } from 'app/actions/ActionTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store/rootReducer';

interface AuthState {
  id: number | null;
  username: string | null;
  token: string | null;
  loginFailed: boolean;
  loggingIn: boolean;
  registrationToken: string | null;
  studentConfirmed: boolean | null;
}

const initialState: AuthState = {
  username: null,
  id: null,
  token: null,
  loginFailed: false,
  loggingIn: false,
  registrationToken: null,
  studentConfirmed: null,
};

interface ActionWithToken extends AnyAction {
  payload: {
    token: string;
  };
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(User.LOGIN.BEGIN, (state) => {
        state.loggingIn = true;
        state.loginFailed = false;
      })
      .addCase(User.LOGIN.FAILURE, (state) => {
        state.loggingIn = false;
        state.loginFailed = true;
      })
      .addCase(User.FETCH.SUCCESS, (state, action) => {
        if (action.meta.isCurrentUser) {
          state.id = action.payload.result;
          state.username =
            action.payload.entities.users[action.payload.result].username;
        }
      })
      .addCase(User.VALIDATE_REGISTRATION_TOKEN.SUCCESS, (state, action) => {
        state.registrationToken = action.payload.token;
      })
      .addCase(User.CONFIRM_STUDENT_USER.FAILURE, (state) => {
        state.studentConfirmed = false;
      })
      .addCase(User.CONFIRM_STUDENT_USER.SUCCESS, (state) => {
        state.studentConfirmed = true;
      })
      .addMatcher(
        (action: AnyAction): action is ActionWithToken =>
          [
            User.CREATE_USER.SUCCESS,
            User.LOGIN.SUCCESS,
            User.REFRESH_TOKEN.SUCCESS,
          ].includes(action.type),
        (state, action) => {
          state.loggingIn = false;
          state.token = action.payload.token;
          state.registrationToken = null;
        }
      );
  },
});

export default authSlice.reducer;

export function selectIsLoggedIn(state: RootState) {
  return state.auth.token !== null;
}
export const selectCurrentUser = createSelector(
  (state: RootState) => state.users.byId,
  (state: RootState) => state.auth.id,
  (usersById, userId) => usersById[userId] || {}
);
