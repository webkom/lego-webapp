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

export function login(username: string, password: string) {
  return (dispatch: $FlowFixMe) =>
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
  return (dispatch: $FlowFixMe) => {
    removeToken();
    dispatch({ type: User.LOGOUT });
    dispatch(replace('/'));
  };
}

export function updateUser(
  user: Object,
  options: Object = { noRedirect: false }
) {
  const {
    username,
    firstName,
    lastName,
    email,
    gender,
    allergies,
    profilePicture
  } = user;
  return (dispatch: $FlowFixMe) =>
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

type PasswordPayload = {
  password: string,
  newPassword: string,
  retypeNewPassword: string
};

export function changePassword({
  password,
  newPassword,
  retypeNewPassword
}: PasswordPayload) {
  return (dispatch: $FlowFixMe) =>
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

export function updatePicture({ picture }: { picture: string }) {
  return (dispatch: $FlowFixMe, getState: $FlowFixMe) => {
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

export function refreshToken(token: string) {
  return callAPI({
    types: User.LOGIN,
    endpoint: '//authorization/token-auth/refresh/',
    method: 'post',
    body: { token }
  });
}

export function loginWithExistingToken(token: string) {
  return (dispatch: $FlowFixMe) => {
    // TODO(ek): Remove $FlowFixMe when we use a flow-typed version
    // that has correct types for isSame
    // (fixed in https://github.com/flowtype/flow-typed/commit/f3b9c89b85cdb463edeb707866a764508626cef1).
    const expirationDate: $FlowFixMe = getExpirationDate(token);
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
  return (dispatch: $FlowFixMe) => {
    const token = loadToken();

    if (token) {
      return dispatch(loginWithExistingToken(token));
    }

    return Promise.resolve();
  };
}

type EmailArgs = { email: string, captchaResponse: string };
export function sendRegistrationEmail({ email, captchaResponse }: EmailArgs) {
  return (dispatch: $FlowFixMe) =>
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

export function validateRegistrationToken(token: string) {
  return (dispatch: $FlowFixMe) =>
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

export function createUser(token: string, user: string) {
  return (dispatch: $FlowFixMe) =>
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

export function sendStudentConfirmationEmail(user: string) {
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

export function confirmStudentUser(token: string) {
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
