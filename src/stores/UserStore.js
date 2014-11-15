'use strict';

var createStore = require('./createStore');
var UserActionTypes = require('../Constants').UserActionTypes;

var _user = {};
var _isLoggedIn = false;
var _loginFailed = false;

var UserStore = createStore({

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
  }
  
}, function(payload) {
  var action = payload.action;
  switch (action.type) {
    case UserActionTypes.RECEIVE_USER_INFO:
      _user = action.userInfo;
      _isLoggedIn = true;
      _loginFailed = false;
      UserStore.emitChange();
      break;

    case UserActionTypes.FAILED_LOGIN:
      _loginFailed = true;
      UserStore.emitChange();
      break;

    case UserActionTypes.LOGIN:
      _loginFailed = false;
      UserStore.emitChange();
      break;

    case UserActionTypes.LOGOUT:
      UserStore.destroy();
      UserStore.emitChange();
      break;
  }

  return true; // crucial
});

module.exports = UserStore;