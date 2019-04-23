import auth from '../auth';
import { User } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('auth', () => {
    it('should have correct initialState', () => {
      const prevState = undefined;
      expect(auth(prevState, {})).toEqual({
        username: null,
        id: null,
        token: null,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null
      });
    });

    it('should set loggingIn to true and loginFailed to false while logging in', () => {
      const prevState = undefined;
      const action = { type: User.LOGIN.BEGIN };
      const state = auth(prevState, action);
      expect(state.loggingIn).toEqual(true);
      expect(state.loginFailed).toEqual(false);
    });

    it('should set loggingIn to false and loginFailed to true when logging in fails', () => {
      const prevState = auth(undefined, { type: User.LOGIN.BEGIN });
      const action = { type: User.LOGIN.FAILURE };
      const state = auth(prevState, action);
      expect(state.loggingIn).toEqual(false);
      expect(state.loginFailed).toEqual(true);
    });

    it('should set username and token correctly when login succeeds', () => {
      const prevState = auth(undefined, { type: User.LOGIN.BEGIN });
      const action = {
        type: User.LOGIN.SUCCESS,
        payload: {
          token: 'azaz',
          user: {
            username: 'test'
          }
        }
      };
      expect(auth(prevState, action)).toEqual({
        username: null,
        id: null,
        token: action.payload.token,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null
      });
    });

    it('should clear the username and token when logging out', () => {
      const _prevState = auth(undefined, { type: User.LOGIN.BEGIN });
      const _action = {
        type: User.LOGIN.SUCCESS,
        payload: {
          token: 'azaz',
          user: {
            username: 'test'
          }
        }
      };

      const prevState = auth(_prevState, _action);
      const action = { type: User.LOGOUT };
      expect(auth(prevState, action)).toEqual({
        username: null,
        id: null,
        token: null,
        loginFailed: false,
        loggingIn: false,
        registrationToken: null,
        studentConfirmed: null
      });
    });
  });
});
