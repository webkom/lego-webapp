'use strict';

var Dispatcher = require('lego-flux/lib/Dispatcher');
var UserService = require('../services/UserService');

var UserActionCreators = {

  // move this out so other action creators can use it
  _serverCall: function(actionName, serviceMethod, ...args) {
    var self = this;
    serviceMethod.apply(serviceMethod, args.concat([function(err, payload) {
      if (err) return self[actionName + 'Failed'](err);
      return self[actionName + 'Completed'](payload);
    }]));
  },

  login: function(username, password) {
    Dispatcher.handleViewAction({
      type: 'LOGIN',
      username: username,
      password: password
    });

    this._serverCall('login', UserService.login, username, password);
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
      type: 'LOGIN_FAILED',
    });
  }
};

module.exports = UserActionCreators;
