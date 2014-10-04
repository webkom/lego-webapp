/**
 * This file is provided by Webkom for the LEGO Web Interface.
 *
 * Big fat disclaimer goes here
 */

var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../Constants').UserActionTypes;
var UserStore = require('../stores/UserStore');

module.exports = {

  login: function(username, password) {
    AppDispatcher.handleViewAction({
      type: UserActionTypes.LOGIN,
      username: username,
      password: password
    });

    AuthService.login(username, password);
  },

  receiveUserInfo: function(userInfo) {
    AppDispatcher.handleServerAction({
      type: UserActionTypes.RECEIVE_USER_INFO,
      userInfo: userInfo
    });
  },
};
