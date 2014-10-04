var Store = require('./Store');
var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../Constants').UserActionTypes;

var _user = {};
var _isLoggedIn = false;

var UserStore = Store.create({

  getUserInfo: function() {
    return _user;
  },

  isLoggedIn: function() {
    return _isLoggedIn;
  }
});

UserStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch (action.type) {
    case UserActionTypes.RECEIVE_USER_INFO:
      _user = action.userInfo;
      _isLoggedIn = true;
      UserStore.emitChange();
      break;

    case UserActionTypes.LOGIN:
      UserStore.emitChange();
      break;
  }

  return true; // crucial
});

module.exports = UserStore;
