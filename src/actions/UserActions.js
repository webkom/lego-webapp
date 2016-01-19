import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { replaceState, pushState } from 'redux-react-router';
import { User } from './ActionTypes';
import request, { callAPI, post } from '../utils/http';


function putInLocalStorage(key) {
  return payload => {
    window.localStorage.setItem(key, JSON.stringify(payload));
    return payload;
  };
}

function clearLocalStorage(key) {
  window.localStorage.removeItem(key);
}

function performLogin(username, password) {
  return post('//authorization/token-auth/', { username, password })
    .then(putInLocalStorage('user'));
}

export function refreshToken(token) {
  return post('//authorization/token-auth/refresh/', { token })
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
  return dispatch => {
    window.localStorage.removeItem('user');
    dispatch({ type: User.LOGOUT });
    dispatch(replaceState(null, '/'));
  };
}

export function updateUser({ username, firstName, lastName, email }) {
  return (dispatch, getState) => {
    const options = {
      url: `/users/${username}/`,
      method: 'put',
      body: {
        username,
        first_name: firstName,
        last_name: lastName,
        email
      },
      jwtToken: getState().auth.token
    };

    dispatch({
      promise: request(options),
      types: {
        begin: User.UPDATE_BEGIN,
        success: [
          User.UPDATE_SUCCESS,
          res => pushState(null, `/users/${res.payload.username || 'me'}`)
        ],
        failure: User.UPDATE_USER_FAILURE
      }
    });
  };
}

export function fetchUser(username) {
  return callAPI({
    type: User.FETCH,
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
  return dispatch => {
    const { user, token } = JSON.parse(window.localStorage.getItem('user')) || {};
    if (token) {
      loginWithExistingToken(dispatch, user, token);
    }
  };
}
