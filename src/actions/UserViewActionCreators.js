'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var UserActionTypes = require('../Constants').UserActionTypes;
var UserService = require('../services/UserService');

module.exports = {

  login: function(username, password) {
    AppDispatcher.handleViewAction({
      type: UserActionTypes.LOGIN,
      username: username,
      password: password
    });

    UserService.login(username, password);
  },

  logout: function() {
    AppDispatcher.handleViewAction({
      type: UserActionTypes.LOGOUT
    });
  }
};
