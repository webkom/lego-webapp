import { User } from './ActionTypes';
import { post } from '../services/RESTService';

function performLogin(username, password) {
  let user = JSON.parse(window.localStorage.getItem('user')) || {};
  if (user.token) return Promise.resolve(user);

  if (!username || !password)
    return Promise.reject(new Error('missing username or password'));

  return post('/login', { username, password })
    .then(data => {
      user = {
        username,
        token: data.authToken
      };

      window.localStorage.setItem('user', JSON.stringify(user));
      return user;
    });
}

export function login(username, password) {
  return {
    type: User.LOGIN,
    promise: performLogin(username, password),
    bailout: state => state.users.userInfo !== null
  }
}

export function loginWithExistingToken(username, token) {
  return {
    type: User.LOGIN_SUCCESS,
    payload: {
      username, token
    }
  };
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible() {
  return (dispatch) => {
    const { username, token } = JSON.parse(window.localStorage.getItem('user')) || {};
    if (username && token) {
      dispatch(loginWithExistingToken(username, token));
    }
  };
}
