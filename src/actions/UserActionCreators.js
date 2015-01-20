'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');
var UserService = require('../services/UserService');

var UserActionCreators = {

  login: function(username, password) {
    Dispatcher.handleViewAction({
      type: 'LOGIN',
      username: username,
      password: password
    });

    UserService.login(username, password, function(err, userInfo) {
      if (err) return UserActionCreators.failedLogin();
      UserActionCreators.receiveUserInfo(userInfo);
    });
  },

  logout: function() {
    Dispatcher.handleViewAction({
      type: 'LOGOUT'
    });
  },

  receiveUserInfo: function(userInfo) {
    Dispatcher.handleServerAction({
      type: 'RECEIVE_USER_INFO',
      userInfo: userInfo
    });
  },

  failedLogin: function() {
    Dispatcher.handleServerAction({
      type: 'FAILED_LOGIN',
    });
  }
};

module.exports = UserActionCreators;
