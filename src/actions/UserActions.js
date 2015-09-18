import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { replaceWith } from 'redux-react-router';
import { User } from './ActionTypes';
import { callAPI, post } from '../http';

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

export function updateUser({username, firstName, lastName, email}){
  console.log('update user', {username, firstName, lastName, email});
  return callAPI({
    method: 'put',
    type: User.UPDATE_USER,
    endpoint: `/users/${username}/`,
    body: {
      username,
      first_name: firstName,
      last_name: lastName,
      email
    }
  });
}

export function fetchUser(username) {
  return callAPI({
    type: User.FETCH_USER,
    endpoint: `/users/${username}/`
  });
}

function getExpirationDate(token) {
  const decodedToken = jwtDecode(token);
  return moment(decodedToken.exp * 1000);
}

export function loginWithExistingToken(dispatch, user, token) {
  const expirationDate = getExpirationDate(token);
  const now = moment();
  if (expirationDate.isSame(now, 'day')) {
    dispatch({
      type: User.LOGIN,
      promise: refreshToken(token)
    });
  } else if (now.isAfter(expirationDate)) {
    clearLocalStorage('token');
  } else {
    dispatch({
      type: User.LOGIN_SUCCESS,
      payload: { user, token }
    });
  }
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible() {
  return (dispatch) => {
    const { user, token } = JSON.parse(window.localStorage.getItem('user')) || {};
    if (token) {
      loginWithExistingToken(dispatch, user, token);
    }
  };
}
