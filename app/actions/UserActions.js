import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { replaceState, pushState } from 'redux-react-router';
import { User } from './ActionTypes';
import { callAPI } from 'app/utils/http';

const USER_STORAGE_KEY = 'user';

function putInLocalStorage(key) {
  return payload => {
    window.localStorage.setItem(key, JSON.stringify(payload));
    return payload;
  };
}

function clearLocalStorage(key) {
  window.localStorage.removeItem(key);
}

export function login(username, password) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [User.LOGIN_BEGIN, User.LOGIN_SUCCESS, User.LOGIN_FAILURE],
      endpoint: `//authorization/token-auth/`,
      method: 'post',
      body: {
        username,
        password
      }
    })).then(putInLocalStorage(USER_STORAGE_KEY));
  };
}

export function logout() {
  return dispatch => {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    dispatch({ type: User.LOGOUT });
    dispatch(replaceState(null, '/'));
  };
}

export function updateUser({ username, firstName, lastName, email }) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    dispatch(callAPI({
      types: [User.UPDATE_BEGIN, User.UPDATE_SUCCESS, User.UPDATE_FAILURE],
      endpoint: `/users/${username}/`,
      method: 'put',
      body: {
        username,
        first_name: firstName,
        last_name: lastName,
        email
      }
    })).then((action) => {
      dispatch(pushState(null, `/users/${action.payload.username || 'me'}`));
      if (getState().auth.username === username) {
        putInLocalStorage(USER_STORAGE_KEY)({ token, user: action.payload });
      }
    });
  };
}

export function fetchUser(username) {
  return callAPI({
    types: [User.FETCH_BEGIN, User.FETCH_SUCCESS, User.FETCH_FAILURE],
    endpoint: `/users/${username}/`
  });
}

function getExpirationDate(token) {
  const decodedToken = jwtDecode(token);
  return moment(decodedToken.exp * 1000);
}

export function refreshToken(token) {
  return callAPI({
    types: [User.LOGIN_BEGIN, User.LOGIN_SUCCESS, User.LOGIN_FAILURE],
    endpoint: '//authorization/token-auth/refresh/',
    body: { token }
  });
}

export function loginWithExistingToken(user, token) {
  return (dispatch) => {
    const expirationDate = getExpirationDate(token);
    const now = moment();
    if (expirationDate.isSame(now, 'day')) {
      dispatch(refreshToken(token))
        .then(putInLocalStorage(USER_STORAGE_KEY))
        .catch(err => {
          clearLocalStorage(USER_STORAGE_KEY);
          throw err;
        });
    } else if (now.isAfter(expirationDate)) {
      clearLocalStorage(USER_STORAGE_KEY);
    } else {
      dispatch({
        type: User.LOGIN_SUCCESS,
        payload: { user, token }
      });
    }
  };
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible() {
  return dispatch => {
    const { user, token } = JSON.parse(
      window.localStorage.getItem(USER_STORAGE_KEY)
    ) || {};

    if (token) {
      dispatch(loginWithExistingToken(user, token));
    }
  };
}
