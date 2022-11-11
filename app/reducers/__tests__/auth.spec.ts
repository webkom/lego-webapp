import { login } from 'app/actions/UserActions';
import type { MeUser } from 'app/store/models/User';
import auth, { logout } from '../auth';

describe('reducers', () => {
  describe('auth', () => {
    it('should have correct initialState', () => {
      const prevState = undefined;
      expect(
        auth(prevState, {
          type: 'SOME_ACTION',
        })
      ).toEqual({
        username: null,
        id: null,
        token: null,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null,
      });
    });
    it('should set loggingIn to true and loginFailed to false while logging in', () => {
      const prevState = undefined;
      const action = login.begin({
        meta: { errorMessage: '' },
      });
      const state = auth(prevState, action);
      expect(state.loggingIn).toBe(true);
      expect(state.loginFailed).toBe(false);
    });
    it('should set loggingIn to false and loginFailed to true when logging in fails', () => {
      const prevState = auth(
        undefined,
        login.begin({
          meta: { errorMessage: '' },
        })
      );
      const action = login.failure({
        meta: { errorMessage: '' },
        payload: null,
      });
      const state = auth(prevState, action);
      expect(state.loggingIn).toBe(false);
      expect(state.loginFailed).toBe(true);
    });
    it('should set username and token correctly when login succeeds', () => {
      const prevState = auth(
        undefined,
        login.begin({
          meta: { errorMessage: '' },
        })
      );
      const action = login.success({
        meta: { errorMessage: '' },
        payload: {
          token: 'azaz',
          user: {
            username: 'test',
          } as MeUser,
        },
      });
      expect(auth(prevState, action)).toEqual({
        username: null,
        id: null,
        token: action.payload.token,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null,
      });
    });
    it('should clear the username and token when logging out', () => {
      const _prevState = auth(
        undefined,
        login.begin({
          meta: { errorMessage: '' },
        })
      );

      const _action = login.success({
        meta: { errorMessage: '' },
        payload: {
          token: 'azaz',
          user: {
            username: 'test',
          } as MeUser,
        },
      });
      const prevState = auth(_prevState, _action);
      const action = logout();
      expect(auth(prevState, action)).toEqual({
        username: null,
        id: null,
        token: null,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null,
      });
    });
  });
});
