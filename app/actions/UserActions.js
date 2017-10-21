// @flow

import jwtDecode from 'jwt-decode';
import { normalize } from 'normalizr';
import cookie from 'react-cookie';
import moment from 'moment-timezone';
import { push, replace } from 'react-router-redux';
import { userSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { User } from './ActionTypes';
import { uploadFile } from './FileActions';
import { fetchMeta } from './MetaActions';
import { addNotification } from 'app/actions/NotificationActions';
import type { Thunk, Action } from 'app/types';

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

export function login(
  username: string,
  password: string
): Thunk<Promise<?Action>> {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.LOGIN,
        endpoint: '//authorization/token-auth/',
        method: 'POST',
        body: {
          username,
          password
        },
        meta: {
          errorMessage: 'Kunne ikke logge inn'
        }
      })
    ).then(action => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      saveToken(token);
      dispatch(fetchMeta());
      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true
        }
      });
    });
}

export function logout(): Thunk<void> {
  return dispatch => {
    removeToken();
    dispatch({ type: User.LOGOUT });
    dispatch(replace('/'));
    // $FlowFixMe
    dispatch(fetchMeta());
  };
}

export function updateUser(
  user: Object /*Todo: UserModel*/,
  options: { noRedirect: boolean } = { noRedirect: false }
): Thunk<Promise<?Action>> {
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
          successMessage: 'Oppdatering av bruker fullført',
          errorMessage: 'Oppdatering av bruker feilet'
        }
      })
    ).then(action => {
      if (!action || !action.payload) return;
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
}: PasswordPayload): Thunk<*> {
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
          errorMessage: 'Oppdatering av passord feilet'
        }
      })
    ).then(action => {
      dispatch(
        push(
          `/users/${(action && action.payload && action.payload.result) ||
            'me'}`
        )
      );
      dispatch(
        addNotification({
          message: 'Passordet ble endret',
          dismissAfter: 5000
        })
      );
    });
}

export function updatePicture({
  username,
  picture
}: {
  picture: File,
  username: string
}): Thunk<*> {
  return (dispatch, getState) => {
    return dispatch(uploadFile({ file: picture })).then(action =>
      dispatch(
        updateUser(
          {
            username,
            profilePicture: action && action.meta ? action.meta.fileToken : null
          },
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
    useCache: false,
    meta: {
      errorMessage: 'Henting av bruker feilet',
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
    method: 'POST',
    body: { token }
  });
}

export function loginWithExistingToken(token: string): Thunk<any> {
  return dispatch => {
    // TODO(ek): Remove FlowFixMe when we use a flow-typed version
    // that has correct types for isSame
    // (fixed in https://github.com/flowtype/flow-typed/commit/f3b9c89b85cdb463edeb707866a764508626cef1).
    const expirationDate: $FlowFixMe = getExpirationDate(token);
    const now = moment();

    if (now.isAfter(expirationDate)) {
      removeToken();
      return Promise.resolve();
    }

    if (expirationDate.isSame(now, 'day')) {
      return dispatch(refreshToken(token))
        .then(action => action && saveToken(action.payload))
        .catch(err => {
          removeToken();
          throw err;
        });
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
export function loginAutomaticallyIfPossible(): Thunk<*> {
  return dispatch => {
    const token = loadToken();

    if (token) {
      return dispatch(loginWithExistingToken(token));
    }

    return Promise.resolve();
  };
}

type EmailArgs = { email: string, captchaResponse: string };
export function sendRegistrationEmail({
  email,
  captchaResponse
}: EmailArgs): Thunk<*> {
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
          errorMessage: 'Sending av registrerings-epost feilet'
        }
      })
    );
}

export function validateRegistrationToken(token: string): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.VALIDATE_REGISTRATION_TOKEN,
        endpoint: `/users-registration-request/?token=${token}`,
        meta: {
          errorMessage: 'Validering av registrerings-token feilet',
          token
        }
      })
    );
}

export function createUser(token: string, user: string): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.CREATE_USER,
        endpoint: `/users/?token=${token}`,
        method: 'POST',
        body: user,
        meta: {
          errorMessage: 'Opprettelse av bruker feilet'
        }
      })
    ).then(action => {
      if (!action || !action.payload) return;
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
      errorMessage: 'Sending av student bekreftelsesepost feilet'
    }
  });
}

export function confirmStudentUser(token: string) {
  return callAPI({
    types: User.CONFIRM_STUDENT_USER,
    endpoint: `/users-student-confirmation-perform/?token=${token}`,
    method: 'POST',
    meta: {
      errorMessage: 'Student bekreftelse feilet'
    },
    useCache: true
  });
}

export function sendForgotPasswordEmail({
  email
}: {
  email: string
}): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.SEND_FORGOT_PASSWORD_REQUEST,
        endpoint: '/password-reset-request/',
        method: 'POST',
        body: {
          email
        },
        meta: {
          errorMessage: 'Sending av tilbakestill passord e-post feilet'
        }
      })
    );
}

export function resetPassword({
  token,
  password
}: {
  token: string,
  password: string
}): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: User.RESET_PASSWORD,
        endpoint: '/password-reset-perform/',
        method: 'POST',
        body: {
          token,
          password
        },
        meta: {
          errorMessage: 'Tilbakestilling av passord feilet'
        }
      })
    );
}
