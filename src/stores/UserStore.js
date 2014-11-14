var Store = require('./Store');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserActionTypes = require('../Constants').UserActionTypes;

var _user = {};
var _isLoggedIn = false;
var _loginFailed = false;

var UserStore = Store.create({

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
  }
});

UserStore.dispatchToken = AppDispatcher.register(function(payload) {
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
