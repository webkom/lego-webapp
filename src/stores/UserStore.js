'use strict';

var {createStore, registerStore, Dispatcher} = require('lego-flux');

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

  getUserInfo: function() {
    return _user;
  },

  isLoggedIn: function() {
    return _isLoggedIn;
  },

  destroy: function() {
    _user = {};
    _isLoggedIn = false;
    _loginFailed = false;
  },

  didLoginFail: function() {
    return _loginFailed;
  },

  _onLoginCompleted: function(action) {
    _user = action.userInfo;
    _isLoggedIn = true;
    _loginFailed = false;
    this.emitChange();
  },

  _onLoginFailed: function(action) {
    _loginFailed = true;
    this.emitChange();
  },

  _onLogin: function(action) {
    _loginFailed = true;
    this.emitChange();
  },

  _onLogout: function(action) {
    this.destroy();
    this.emitChange();
  }
});

registerStore(Dispatcher, UserStore);

module.exports = UserStore;
