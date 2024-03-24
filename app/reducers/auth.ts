import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { validateRegistrationToken } from 'app/actions/UserActions';
import { selectUserEntities } from 'app/reducers/users';
import { useAppSelector } from 'app/store/hooks';
import { User } from '../actions/ActionTypes';
import type { AnyAction, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type { CurrentUser } from 'app/store/models/User';

type AuthState = {
  id: number | null;
  username: string | null;
  token: string | null;
  loginFailed: boolean;
  loggingIn: boolean;
  registrationToken: string | null;
  studentConfirmed: boolean | null;
};

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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(User.LOGIN.BEGIN, (state) => {
      state.loggingIn = true;
      state.loginFailed = false;
    });
    builder.addCase(User.LOGIN.FAILURE, (state) => {
      state.loggingIn = false;
      state.loginFailed = true;
    });
    builder.addCase(User.FETCH.SUCCESS, (state, action: AnyAction) => {
      if (!action.meta.isCurrentUser) {
        return;
      }
      state.id = action.payload.result;
      state.username =
        action.payload.entities.users[action.payload.result].username;
    });
    builder.addCase(User.LOGOUT, () => initialState);
    builder.addCase(validateRegistrationToken.fulfilled, (state, action) => {
      state.registrationToken = action.meta.extra.token;
    });

    builder.addMatcher(isLoginTokenAction, (state, action) => {
      state.loggingIn = false;
      state.token = action.payload.token;
      state.registrationToken = null;
    });
  },
});

export default authSlice.reducer;

type LoginTokenAction = PayloadAction<{ token: string }>;
const isLoginTokenAction = (
  action: UnknownAction,
): action is LoginTokenAction =>
  action.type === User.LOGIN.SUCCESS ||
  action.type === User.CREATE_USER.SUCCESS ||
  action.type === User.REFRESH_TOKEN.SUCCESS;

export const selectIsLoggedIn = (state: RootState) => state.auth.token !== null;
export const selectCurrentUser = createSelector(
  selectUserEntities,
  (state: RootState) => state.auth.id,
  (userEntities, userId) => {
    if (!userId) return undefined;
    const user = userEntities[userId];
    // ensure we have a user object serialized with "MeSerializer" (CurrentUser type)
    if (!user || !('icalToken' in user)) return undefined;
    return user satisfies CurrentUser;
  },
);

export const useIsLoggedIn = () => useAppSelector(selectIsLoggedIn);
export const useCurrentUser = () => useAppSelector(selectCurrentUser);
