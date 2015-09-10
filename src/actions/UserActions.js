import { User } from './ActionTypes';
import { post } from '../http';
import { replaceWith } from 'redux-react-router';

function putInLocalStorage(key) {
  return (payload) => {
    window.localStorage.setItem(key, JSON.stringify(payload));
    return payload;
  };
}

function clearLocalStorage(key) {
  window.localStorage.removeItem(key);
}

function performLogin(username, password) {
  return post('/token-auth/', { username, password })
    .then(putInLocalStorage('user'));
}

export function refreshToken(token) {
  return post('/token-auth/refresh/', { token })
    .then(putInLocalStorage('user'))
    .catch(err => {
      clearLocalStorage('user');
      throw err;
    });
}


export function login(username, password) {
  return {
    type: User.LOGIN,
    promise: performLogin(username, password)
  };
}

export function logout() {
  return (dispatch) => {
    window.localStorage.removeItem('user');
    dispatch({ type: User.LOGOUT });
    dispatch(replaceWith('/'));
  };
}

export function loginWithExistingToken(token) {
  return {
    type: User.LOGIN,
    promise: refreshToken(token)
  };
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible() {
  return (dispatch) => {
    const { token } = JSON.parse(window.localStorage.getItem('user')) || {};
    if (token) {
      dispatch(loginWithExistingToken(token));
    }
  };
}
