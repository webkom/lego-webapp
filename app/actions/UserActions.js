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
import { addNotification } from 'app/actions/NotificationActions';

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

export function changePassword({ password, newPassword, retypeNewPassword }) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.PASSWORD_CHANGE,
        endpoint: '/password-change/',
        method: 'POST',
        body: {
          password,
          newPassword,
          retypeNewPassword
        },
        schema: userSchema,
        meta: {
          errorMessage: 'Updating password failed'
        }
      })
    ).then(action => {
      dispatch(push(`/users/${action.payload.result || 'me'}`));
      dispatch(
        addNotification({
          message: 'Passordet ble endret',
          dismissAfter: 5000
        })
      );
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

export function fetchUser(username: string = 'me') {
  return callAPI({
    types: User.FETCH,
    endpoint: `/users/${username}/`,
    schema: userSchema,
    force: true,
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
        },
        meta: {
          errorMessage: 'Sending registration mail failed'
        }
      })
    );
}

export function validateRegistrationToken(token) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.VALIDATE_REGISTRATION_TOKEN,
        endpoint: `/users-registration-request/?token=${token}`,
        meta: {
          errorMessage: 'Validating registration token failed',
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
        body: user,
        meta: {
          errorMessage: 'Creating user failed'
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

export function sendStudentConfirmationEmail(user) {
  return callAPI({
    types: User.SEND_STUDENT_CONFIRMATION_TOKEN,
    endpoint: `/users-student-confirmation-request/`,
    method: 'POST',
    body: user,
    meta: {
      errorMessage: 'Sending student confirmation mail failed'
    }
  });
}

export function confirmStudentUser(token) {
  return callAPI({
    types: User.CONFIRM_STUDENT_USER,
    endpoint: `/users-student-confirmation-perform/?token=${token}`,
    method: 'POST',
    meta: {
      errorMessage: 'Student confirmation failed'
    },
    useCache: true
  });
}

export function followUser(me: object, user: object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.FOLLOW_USER,
        endpoint: `/followers-user/`,
        method: 'POST',
        body: {
          target: user.id
        },
        meta: {
          follower: me,
          user,
          errorMessage: 'Kunne ikke følge brukeren.'
        }
      })
    );
}

export function unfollowUser(me: object, user: object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.GET_FOLLOW,
        endpoint: `/followers-user/?following=${me.id}&target=${user.id}`,
        method: 'GET',
        meta: {
          errorMessage: 'Kunne ikke hente følgen.'
        }
      })
    ).then(res => {
      return dispatch(
        callAPI({
          types: User.UNFOLLOW_USER,
          endpoint: `/followers-user/${res.payload[0].id}/`,
          method: 'DELETE',
          meta: {
            follower: me,
            user,
            errorMessage: 'Kunne ikke slutte å følge brukeren.'
          }
        })
      );
    });
}

export function fetchUserFollowings(me: object) {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.FETCH_USER_FOLLOWINGS,
        endpoint: `/followers-user/?follower=${me.id}`,
        method: 'GET',
        meta: {
          currentUser: me,
          errorMessage: 'Fant ikke ut hvilke brukere du følger'
        }
      })
    );
}
