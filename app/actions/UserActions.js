// @flow

import jwtDecode from 'jwt-decode';
import { normalize } from 'normalizr';
import cookie from 'react-cookie';
import moment from 'moment';
import { push, replace } from 'react-router-redux';
import { userSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { User } from './ActionTypes';
import { uploadFile } from './FileActions';

const USER_STORAGE_KEY = 'lego.auth';

function loadToken() {
  return cookie.load(USER_STORAGE_KEY);
}

function saveToken(token) {
  return cookie.save(USER_STORAGE_KEY, token, { path: '/' });
}

function removeToken() {
  return cookie.remove(USER_STORAGE_KEY, { path: '/' });
}

export function login(username, password) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.LOGIN,
        endpoint: '//authorization/token-auth/',
        method: 'post',
        body: {
          username,
          password
        },
        meta: {
          errorMessage: 'Login failed'
        }
      })
    ).then(action => {
      const { user, token } = action.payload;
      saveToken(token);

      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true
        }
      });
    });
}

export function logout() {
  return dispatch => {
    removeToken();
    dispatch({ type: User.LOGOUT });
    dispatch(replace('/'));
  };
}

export function updateUser(user, options = { noRedirect: false }) {
  const {
    username,
    firstName,
    lastName,
    email,
    gender,
    allergies,
    profilePicture
  } = user;
  return dispatch =>
    dispatch(
      callAPI({
        types: User.UPDATE,
        endpoint: `/users/${username}/`,
        method: 'PATCH',
        body: {
          username,
          firstName,
          lastName,
          email,
          gender,
          allergies,
          profilePicture
        },
        schema: userSchema,
        meta: {
          errorMessage: 'Updating user failed'
        }
      })
    ).then(action => {
      if (!options.noRedirect) {
        dispatch(push(`/users/${action.payload.result || 'me'}`));
      }
    });
}

export function updatePicture({ picture }) {
  return (dispatch, getState) => {
    const username = getState().auth.username;
    return dispatch(uploadFile({ file: picture })).then(action =>
      dispatch(
        updateUser(
          { username, profilePicture: action.meta.fileToken },
          { noRedirect: true }
        )
      )
    );
  };
}

export function fetchUser(username = 'me') {
  return callAPI({
    types: User.FETCH,
    endpoint: `/users/${username}/`,
    schema: userSchema,
    meta: {
      errorMessage: 'Fetching user failed',
      isCurrentUser: username === 'me'
    },
    propagateError: true
  });
}

function getExpirationDate(token) {
  const decodedToken = jwtDecode(token);
  return moment(decodedToken.exp * 1000);
}

export function refreshToken(token) {
  return callAPI({
    types: User.LOGIN,
    endpoint: '//authorization/token-auth/refresh/',
    method: 'post',
    body: { token }
  });
}

export function loginWithExistingToken(token) {
  return dispatch => {
    const expirationDate = getExpirationDate(token);
    const now = moment();

    if (expirationDate.isSame(now, 'day')) {
      return dispatch(refreshToken(token))
        .then(action => saveToken(action.payload))
        .catch(err => {
          removeToken();
          throw err;
        });
    }

    if (now.isAfter(expirationDate)) {
      removeToken();
      return Promise.resolve();
    }

    dispatch({
      type: User.LOGIN.SUCCESS,
      payload: { token }
    });

    return dispatch(fetchUser());
  };
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible() {
  return dispatch => {
    const token = loadToken();

    if (token) {
      return dispatch(loginWithExistingToken(token));
    }

    return Promise.resolve();
  };
}

export function sendRegistrationEmail({ email, captchaResponse }) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.SEND_REGISTRATION_TOKEN,
        endpoint: '/users-registration-request/',
        method: 'POST',
        body: {
          email,
          captchaResponse
        }
      })
    );
}

export function validateRegistrationToken({ token }) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.VALIDATE_REGISTRATION_TOKEN,
        endpoint: `/users-registration-request/?token=${token}`,
        meta: {
          token
        }
      })
    );
}

export function createUser(token, user) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.CREATE_USER,
        endpoint: `/users/?token=${token}`,
        method: 'POST',
        body: user
      })
    ).then(action => {
      const { user, token } = action.payload;
      saveToken(token);

      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true
        }
      });
    });
}
