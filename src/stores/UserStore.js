import createStore from './createStore';

var _user = {};
var _token = null;
var _isLoggedIn = false;
var _loginFailed = false;

export default createStore({

  getUserInfo() {
    return _user;
  },

  getTokenHeader() {
    return `JWT ${_token}`;
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
    }
  }
});
