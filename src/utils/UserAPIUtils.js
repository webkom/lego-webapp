import Bluebird from 'bluebird';
import * as UserService from '../services/UserService';
import UserStore from '../stores/UserStore';
import UserActions from '../actions/UserActions';
import { InvalidTokenError } from '../errors/error-predicates';

export function tokenLogin() {
  var token = UserStore.getToken();

  if (token) {
    return UserService.tokenLogin(token)
      .then(function(userInfo) {
        return UserActions.loginCompleted(userInfo);
      })
      .catch(InvalidTokenError, function() {
        UserActions.refreshTokenFailed();
      });
  }

  return Bluebird.resolve();
}
