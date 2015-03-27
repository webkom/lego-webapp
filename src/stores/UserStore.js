import createStore from './createStore';
import * as localStorage from '../localStorage';

var _user = {};
var _token = null;
var _isLoggedIn = false;
var _loginFailed = false;

export default createStore({

  getUserInfo() {
    return _user;
  },

  getToken() {
    if (!_token) {
      return localStorage.getItem('token');
    }
    return _token;
  },

  isLoggedIn() {
    return _isLoggedIn;
  },

  destroy() {
    _user = {};
    _isLoggedIn = false;
    _loginFailed = false;
  },

  didLoginFail() {
    return _loginFailed;
  },

  actions: {
    loginCompleted(action) {
      _user = action.userInfo.user;
      _token = action.userInfo.token;
      localStorage.setItem('token', _token);

      _isLoggedIn = true;
      _loginFailed = false;
      this.emitChange();
    },

    loginFailed(action) {
      _loginFailed = true;
      this.emitChange();
    },

    login(action) {
      _loginFailed = true;
      this.emitChange();
    },

    logout(action) {
      this.destroy();
      this.emitChange();
    },

    refreshTokenFailed(action) {
      localStorage.removeItem('token');
    }
  }
});
