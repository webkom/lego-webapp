import Dispatcher from 'lego-flux/lib/Dispatcher';
import UserService from '../services/UserService';
import tryServerAction from '../tryServerAction';

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

export default UserActionCreators;
