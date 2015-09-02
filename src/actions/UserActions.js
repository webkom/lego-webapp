import { User } from './ActionTypes';
import { post } from '../http';
import { transitionTo, replaceWith } from 'redux-react-router';
import { callAPI } from '../http';

function putInLocalStorage(key) {
  return (payload) => {
    window.localStorage.setItem(key, JSON.stringify(payload));
    return payload;
  };
}

function performLogin(username, password) {
  return post('/login', { username, password })
    .then(data => ({ username, token: data.authToken }))
    .then(putInLocalStorage('user'));
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

export function loginWithExistingToken(username, token) {
  return {
    type: User.LOGIN_SUCCESS,
    payload: { username, token }
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
