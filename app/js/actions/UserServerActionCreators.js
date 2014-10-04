var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../Constants').UserActionTypes;
var UserService = require('../services/UserService');

module.exports = {

  receiveUserInfo: function(userInfo) {
    AppDispatcher.handleServerAction({
      type: UserActionTypes.RECEIVE_USER_INFO,
      userInfo: userInfo
    });
  }
};
