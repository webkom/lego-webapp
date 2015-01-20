'use strict';

var {createStore, registerStore, Dispatcher} = require('lego-flux');

var _user = {};
var _isLoggedIn = false;
var _loginFailed = false;

var UserStore = createStore({

  actions: {
    'RECEIVE_USER_INFO': '_onReceiveUserInfo',
    'FAILED_LOGIN': '_onFailedLogin',
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

  _onReceiveUserInfo: function(action) {
    _user = action.userInfo;
    _isLoggedIn = true;
    _loginFailed = false;
    this.emitChange();
  },

  _onFailedLogin: function(action) {
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
