import {createStore, registerStore, Dispatcher} from 'lego-flux';

var _user = {};
var _isLoggedIn = false;
var _loginFailed = false;

var UserStore = createStore({

  actions: {
    'LOGIN_COMPLETED': '_onLoginCompleted',
    'LOGIN_FAILED': '_onLoginFailed',
    'LOGIN': '_onLogin',
    'LOGOUT': '_onLogout'
  },

  getUserInfo() {
    return _user;
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

  _onLoginCompleted(action) {
    _user = action.userInfo;
    _isLoggedIn = true;
    _loginFailed = false;
    this.emitChange();
  },

  _onLoginFailed(action) {
    _loginFailed = true;
    this.emitChange();
  },

  _onLogin(action) {
    _loginFailed = true;
    this.emitChange();
  },

  _onLogout(action) {
    this.destroy();
    this.emitChange();
  }
});

registerStore(Dispatcher, UserStore);

export default UserStore;
