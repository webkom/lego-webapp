// @flow

import jwtDecode from 'jwt-decode';
import { normalize } from 'normalizr';
import config from 'app/config';
import cookie from 'js-cookie';
import moment from 'moment-timezone';
import { push } from 'connected-react-router';
import { userSchema, penaltySchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { User, FetchHistory, Penalty } from './ActionTypes';
import { uploadFile } from './FileActions';
import { fetchMeta } from './MetaActions';
import type { Thunk, Action, Token, EncodedToken, GetCookie } from 'app/types';
import type { AddPenalty, ID } from 'app/models';
import { setStatusCode } from './RoutingActions';

const USER_STORAGE_KEY = 'lego.auth';

function saveToken(token: EncodedToken) {
  const decoded = jwtDecode(token);
  const expires = moment.unix(decoded.exp);
  return cookie.set(USER_STORAGE_KEY, token, {
    path: '/',
    expires: expires.toDate(),
    // Only HTTPS in prod:
    secure: config.environment === 'production'
  });
}

function removeToken() {
  return cookie.remove(USER_STORAGE_KEY, { path: '/' });
}

function getToken(getCookie: GetCookie): ?Token {
  const encodedToken = getCookie(USER_STORAGE_KEY);

  if (!encodedToken) return;

  try {
    const decoded = jwtDecode(encodedToken);
    return {
      ...decoded,
      encodedToken
    };
  } catch (e) {
    // Treat invalid tokens as if no token is stored
    return;
  }
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
      dispatch({ type: FetchHistory.CLEAR_HISTORY });
      dispatch(fetchMeta());
      dispatch(setStatusCode(null));
      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true
        }
      });
    });
}

export function logoutWithRedirect() {
  return (dispatch: Dispatch<*>) => {
    dispatch(logout());
    dispatch(push('/'));
  };
}

export function logout() {
  return (dispatch: Dispatch<*>) => {
    removeToken();
    dispatch({ type: User.LOGOUT });
    dispatch(fetchMeta());
  };
}

export function updateUser(
  user: Object /*Todo: UserModel*/,
  options: { noRedirect: boolean, updateProfilePicture?: boolean } = {
    noRedirect: false,
    updateProfilePicture: false
  }
): Thunk<Promise<?Action>> {
  const {
    username,
    firstName,
    lastName,
    email,
    gender,
    allergies,
    profilePicture,
    isAbakusMember,
    emailListsEnabled
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
          isAbakusMember,
          emailListsEnabled,
          ...(options.updateProfilePicture ? { profilePicture } : null)
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
        dispatch(push(`/users/${username}`));
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
  return callAPI({
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
      errorMessage: 'Oppdatering av passord feilet',
      successMessage: 'Passordet ble endret'
    }
  });
}

export function changeGrade(groupId: ID, username: string): Thunk<*> {
  return callAPI({
    types: User.UPDATE,
    endpoint: `/users/${username}/change_grade/`,
    method: 'POST',
    body: {
      group: groupId
    },
    schema: userSchema,
    meta: {
      errorMessage: 'Oppdatering av klasse feilet',
      successMessage: 'Klasse endret'
    }
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
          {
            noRedirect: true,
            updateProfilePicture: true
          }
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

export function refreshToken(token: EncodedToken) {
  return callAPI({
    types: User.REFRESH_TOKEN,
    endpoint: '//authorization/token-auth/refresh/',
    method: 'POST',
    body: { token }
  });
}

export function loginWithExistingToken(token: Token): Thunk<any> {
  return dispatch => {
    const now = moment();
    const expirationTime = moment.unix(token.exp);

    if (now.isAfter(expirationTime)) {
      removeToken();
      return Promise.resolve();
    }

    dispatch({
      type: User.LOGIN.SUCCESS,
      payload: { token: token.encodedToken }
    });

    return dispatch(fetchUser());
  };
}

/**
 * Refreshes the token if it was issued any other day than today.
 */
export function maybeRefreshToken(): Thunk<*> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);
    if (!token) return Promise.resolve();

    const issuedTime = moment.unix(token.orig_iat);
    if (!issuedTime.isSame(moment(), 'day')) {
      return dispatch(refreshToken(token.encodedToken))
        .then(action => saveToken(action.payload.token))
        .catch(err => {
          removeToken();
          throw err;
        });
    }

    return Promise.resolve();
  };
}

/**
 * Dispatch a login success if a token exists in local storage.
 */
export function loginAutomaticallyIfPossible(): Thunk<*> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);
    if (!token) {
      return Promise.resolve();
    }
    return dispatch(loginWithExistingToken(token));
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

export function addPenalty({ user, reason, weight, sourceEvent }: AddPenalty) {
  return callAPI({
    types: Penalty.CREATE,
    endpoint: '/penalties/',
    method: 'POST',
    schema: penaltySchema,
    body: {
      user,
      reason,
      weight,
      sourceEvent
    },
    meta: {
      errorMessage: 'Opprettelse av prikk feilet'
    }
  });
}

export function deletePenalty(id: number) {
  return callAPI({
    types: Penalty.DELETE,
    endpoint: `/penalties/${id}/`,
    method: 'DELETE',
    schema: penaltySchema,
    meta: {
      penaltyId: id,
      errorMessage: 'Sletting av prikk feilet'
    },
    body: {}
  });
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
