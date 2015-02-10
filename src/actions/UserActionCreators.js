import Dispatcher from 'lego-flux/lib/Dispatcher';
import UserService from '../services/UserService';
import tryServerAction from '../tryServerAction';

var UserActionCreators = {

  login(username, password) {
    Dispatcher.handleViewAction({
      type: 'LOGIN',
      username: username,
      password: password
    });

    tryServerAction(this, 'login', UserService.login, username, password);
  },

  logout() {
    Dispatcher.handleViewAction({
      type: 'LOGOUT'
    });
  },

  loginCompleted(userInfo) {
    Dispatcher.handleServerAction({
      type: 'LOGIN_COMPLETED',
      userInfo: userInfo
    });
  },

  loginFailed() {
    Dispatcher.handleServerAction({
      type: 'LOGIN_FAILED'
    });
  }
};

export default UserActionCreators;
