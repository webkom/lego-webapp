'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');
var UserService = require('../services/UserService');
var tryServerAction = require('../tryServerAction');

var UserActionCreators = {

  login: function(username, password) {
    Dispatcher.handleViewAction({
      type: 'LOGIN',
      username: username,
      password: password
    });

    tryServerAction(this, 'login', UserService.login, username, password);
  },

  logout: function() {
    Dispatcher.handleViewAction({
      type: 'LOGOUT'
    });
  },

  loginCompleted: function(userInfo) {
    Dispatcher.handleServerAction({
      type: 'LOGIN_COMPLETED',
      userInfo: userInfo
    });
  },

  loginFailed: function() {
    Dispatcher.handleServerAction({
      type: 'LOGIN_FAILED'
    });
  }
};

module.exports = UserActionCreators;
