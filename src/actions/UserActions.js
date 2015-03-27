import createActions from './createActions';
import * as UserService from '../services/UserService';
import tryServerAction from '../tryServerAction';

export default createActions({

  login(username, password) {
    tryServerAction(this, 'login', UserService.login, username, password);
    return {username, password};
  },

  logout() {},

  loginCompleted(userInfo) {
    return {userInfo};
  },

  refreshTokenFailed() {},

  loginFailed() {}
});
