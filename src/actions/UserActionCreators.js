'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');
var UserService = require('../services/UserService');

module.exports = {

  login: function(username, password) {
    Dispatcher.handleViewAction({
      type: 'LOGIN',
      username: username,
      password: password
    });

    UserService.login(username, password);
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
