import { type AnyAction, createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  confirmStudentUser,
  createUser,
  fetchUser,
  login,
  refreshToken,
  validateRegistrationToken,
} from 'app/actions/UserActions';
import type { ID } from 'app/store/models';
import type { RootState } from 'app/store/rootReducer';

interface AuthState {
  id: ID | null;
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.begin, (state) => {
        state.loggingIn = true;
        state.loginFailed = false;
      })
      .addCase(login.failure, (state) => {
        state.loggingIn = false;
        state.loginFailed = true;
      })
      .addCase(fetchUser.success, (state, action) => {
        if (!action.meta.isCurrentUser) {
          return;
        }

        state.id = action.payload.result;
        state.username =
          action.payload.entities.users[action.payload.result].username;
      })
      .addCase(validateRegistrationToken.success, (state, action) => {
        state.registrationToken = action.meta.token;
      })
      .addCase(confirmStudentUser.failure, (state) => {
        state.studentConfirmed = false;
      })
      .addCase(confirmStudentUser.success, (state) => {
        state.studentConfirmed = true;
      })
      .addMatcher(
        (
          action: AnyAction
        ): action is
          | ReturnType<typeof login.success>
          | ReturnType<typeof createUser.success>
          | ReturnType<typeof refreshToken.success> =>
          login.success.match(action) ||
          createUser.success.match(action) ||
          refreshToken.success.match(action),
        (state, action) => {
          state.loggingIn = false;
          state.token = action.payload.token;
          state.registrationToken = null;
        }
      );
  },
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;

export function selectIsLoggedIn(state: RootState) {
  return state.auth.token !== null;
}
export const selectCurrentUser = createSelector(
  (state: RootState) => state.users.byId,
  (state: RootState) => state.auth.id,
  (usersById, userId) => usersById[userId] || {}
);
