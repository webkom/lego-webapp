import cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import { push } from 'redux-first-history';
import callAPI from 'app/actions/callAPI';
import config from 'app/config';
import { userSchema, penaltySchema } from 'app/reducers';
import { User, Penalty } from './ActionTypes';
import { uploadFile } from './FileActions';
import { fetchMeta } from './MetaActions';
import { setStatusCode } from './RoutingActions';
import type { AddPenalty, ID, PhotoConsent } from 'app/models';
import type { UpdateUser } from 'app/store/models/User';
import type { Thunk, Action, Token, EncodedToken, GetCookie } from 'app/types';

const USER_STORAGE_KEY = 'lego.auth';

function saveToken(token: EncodedToken) {
  const decoded = jwtDecode<Token>(token);
  const expires = moment.unix(decoded.exp);
  return cookie.set(USER_STORAGE_KEY, token, {
    path: '/',
    expires: expires.toDate(),
    // Only HTTPS in prod:
    secure: config.environment === 'production',
  });
}

function removeToken() {
  return cookie.remove(USER_STORAGE_KEY, {
    path: '/',
  });
}

function getToken(getCookie: GetCookie): Token | null | undefined {
  const encodedToken = getCookie(USER_STORAGE_KEY);
  if (!encodedToken) return;

  try {
    const decoded = jwtDecode<Token>(encodedToken);
    return { ...decoded, encodedToken };
  } catch (e) {
    // Treat invalid tokens as if no token is stored
    return;
  }
}

export function login(
  username: string,
  password: string
): Thunk<Promise<Action | null | undefined>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.LOGIN,
        endpoint: '//authorization/token-auth/',
        method: 'POST',
        body: {
          username,
          password,
        },
        meta: {
          errorMessage: 'Kunne ikke logge inn',
        },
      })
    ).then((action) => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      saveToken(token);
      dispatch(fetchMeta());
      dispatch(setStatusCode(null));
      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true,
        },
      });
    });
}
export function logoutWithRedirect(): Thunk<void> {
  return (dispatch) => {
    dispatch(logout());
    dispatch(push('/'));
  };
}
export function logout(): Thunk<void> {
  return (dispatch) => {
    removeToken();
    dispatch({
      type: User.LOGOUT,
    });
    dispatch(fetchMeta());
  };
}
export function updateUser(
  user: UpdateUser,
  options: {
    noRedirect: boolean;
    updateProfilePicture?: boolean;
  } = {
    noRedirect: false,
    updateProfilePicture: false,
  }
): Thunk<Promise<void | Action | null | undefined>> {
  const {
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    gender,
    allergies,
    profilePicture,
    isAbakusMember,
    emailListsEnabled,
    selectedTheme,
    githubUsername,
    linkedinId,
  } = user;
  return (dispatch) =>
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
          phoneNumber,
          gender,
          allergies,
          selectedTheme,
          isAbakusMember,
          emailListsEnabled,
          githubUsername,
          linkedinId,
          ...(options.updateProfilePicture
            ? {
                profilePicture,
              }
            : null),
        },
        schema: userSchema,
        meta: {
          successMessage: 'Oppdatering av bruker fullført',
          errorMessage: 'Oppdatering av bruker feilet',
        },
      })
    ).then((action) => {
      if (!action || !action.payload) return;

      if (!options.noRedirect) {
        dispatch(push(`/users/${username}`));
      }
    });
}
type PasswordPayload = {
  password: string;
  newPassword: string;
  retypeNewPassword: string;
};
export function changePassword({
  password,
  newPassword,
  retypeNewPassword,
}: PasswordPayload): Thunk<void> {
  return callAPI({
    types: User.PASSWORD_CHANGE,
    endpoint: '/password-change/',
    method: 'POST',
    body: {
      password,
      newPassword,
      retypeNewPassword,
    },
    schema: userSchema,
    meta: {
      errorMessage: 'Oppdatering av passord feilet',
      successMessage: 'Passordet ble endret',
    },
  });
}
export function changeGrade(groupId: ID, username: string): Thunk<void> {
  return callAPI({
    types: User.UPDATE,
    endpoint: `/users/${username}/change_grade/`,
    method: 'POST',
    body: {
      group: groupId,
    },
    schema: userSchema,
    meta: {
      errorMessage: 'Oppdatering av klasse feilet',
      successMessage: 'Klasse endret',
    },
  });
}
export function removePicture(username: string): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.UPDATE,
        endpoint: `/users/${username}/`,
        method: 'PATCH',
        body: {
          username,
          profilePicture: null,
        },
        schema: userSchema,
        meta: {
          successMessage: 'Fjerning av profilbilde fullført',
          errorMessage: 'Fjerning av profilbilde feilet',
        },
      })
    );
}
export function updatePhotoConsent(
  photoConsent: PhotoConsent,
  username: string,
  userId: number
): Thunk<void> {
  const { year, semester, domain, isConsenting } = photoConsent;
  return callAPI({
    types: User.UPDATE,
    endpoint: `/users/${username}/update_photo_consent/`,
    method: 'POST',
    body: {
      user: userId,
      year,
      semester,
      domain,
      isConsenting,
    },
    schema: userSchema,
    meta: {
      errorMessage: 'Endring av bildesamtykke feilet',
      successMessage: 'Bildesamtykke endret',
    },
  });
}
export function updatePicture({
  username,
  picture,
}: {
  picture: File;
  username: string;
}): Thunk<void> {
  return (dispatch) => {
    return dispatch(
      uploadFile({
        file: picture,
      })
    ).then((action) =>
      dispatch(
        updateUser(
          {
            username,
            profilePicture:
              action && action.meta ? action.meta.fileToken : null,
          },
          {
            noRedirect: true,
            updateProfilePicture: true,
          }
        )
      )
    );
  };
}

const defaultOptions = {
  propagateError: true,
};

export function fetchUser(
  username = 'me',
  { propagateError } = defaultOptions
): Thunk<void> {
  return callAPI({
    types: User.FETCH,
    endpoint: `/users/${username}/`,
    schema: userSchema,
    meta: {
      errorMessage: 'Henting av bruker feilet',
      isCurrentUser: username === 'me',
    },
    propagateError,
  });
}
export function refreshToken(token: EncodedToken): Thunk<void> {
  return callAPI({
    types: User.REFRESH_TOKEN,
    endpoint: '//authorization/token-auth/refresh/',
    method: 'POST',
    body: {
      token,
    },
  });
}
export function loginWithExistingToken(token: Token): Thunk<void> {
  return (dispatch) => {
    const now = moment();
    const expirationTime = moment.unix(token.exp);

    if (now.isAfter(expirationTime)) {
      removeToken();
      return Promise.resolve();
    }

    dispatch({
      type: User.LOGIN.SUCCESS,
      payload: {
        token: token.encodedToken,
      },
    });
    return dispatch(fetchUser());
  };
}

/**
 * Refreshes the token if it was issued any other day than today.
 */
export function maybeRefreshToken(): Thunk<void> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);
    if (!token) return Promise.resolve();
    const issuedTime = moment.unix(token.orig_iat);

    if (!issuedTime.isSame(moment(), 'day')) {
      return dispatch(refreshToken(token.encodedToken))
        .then((action: any) => saveToken(action.payload.token))
        .catch((err) => {
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
export function loginAutomaticallyIfPossible(): Thunk<void> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);

    if (!token) {
      return Promise.resolve();
    }

    return dispatch(loginWithExistingToken(token));
  };
}
type EmailArgs = {
  email: string;
  captchaResponse: string;
};
export function sendRegistrationEmail({
  email,
  captchaResponse,
}: EmailArgs): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.SEND_REGISTRATION_TOKEN,
        endpoint: '/users-registration-request/',
        method: 'POST',
        body: {
          email,
          captchaResponse,
        },
        meta: {
          errorMessage: 'Sending av registrerings-e-post feilet',
        },
      })
    );
}
export function validateRegistrationToken(token: string): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.VALIDATE_REGISTRATION_TOKEN,
        endpoint: `/users-registration-request/?token=${token}`,
        meta: {
          errorMessage: 'Validering av registrerings-token feilet',
          token,
        },
      })
    );
}
export function createUser(token: string, user: string): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.CREATE_USER,
        endpoint: `/users/?token=${token}`,
        method: 'POST',
        body: user,
        meta: {
          errorMessage: 'Opprettelse av bruker feilet',
        },
      })
    ).then((action) => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      saveToken(token);
      return dispatch({
        type: User.FETCH.SUCCESS,
        payload: normalize(user, userSchema),
        meta: {
          isCurrentUser: true,
        },
      });
    });
}
export function deleteUser(password: string): Thunk<Promise<void>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.DELETE,
        endpoint: '/user-delete/',
        method: 'POST',
        body: {
          password,
        },
        meta: {
          errorMessage: 'Sletting av bruker feilet',
          successMessage: 'Bruker har blitt slettet',
        },
      })
    );
}

export function startStudentAuth(): Thunk<void> {
  return callAPI({
    types: User.INIT_STUDENT_AUTH,
    endpoint: `/oidc/authorize/`,
    method: 'GET',
    meta: {
      errorMessage: 'Student verifisering feilet',
    },
  });
}

export function confirmStudentAuth({
  code,
  state,
}: {
  code: string;
  state: string;
}): Thunk<void> {
  return callAPI({
    types: User.COMPLETE_STUDENT_AUTH,
    endpoint: `/oidc/validate/?code=${code}&state=${state}`,
    method: 'GET',
    meta: {
      errorMessage: 'Validering av studentstatus feilet',
    },
  });
}

export function sendForgotPasswordEmail({
  email,
}: {
  email: string;
}): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.SEND_FORGOT_PASSWORD_REQUEST,
        endpoint: '/password-reset-request/',
        method: 'POST',
        body: {
          email,
        },
        meta: {
          errorMessage: 'Sending av tilbakestill passord e-post feilet',
        },
      })
    );
}
export function addPenalty({
  user,
  reason,
  weight,
  sourceEvent,
}: AddPenalty): Thunk<void> {
  return callAPI({
    types: Penalty.CREATE,
    endpoint: '/penalties/',
    method: 'POST',
    schema: penaltySchema,
    body: {
      user,
      reason,
      weight,
      sourceEvent,
    },
    meta: {
      errorMessage: 'Opprettelse av prikk feilet',
    },
  });
}
export function deletePenalty(id: number): Thunk<void> {
  return callAPI({
    types: Penalty.DELETE,
    endpoint: `/penalties/${id}/`,
    method: 'DELETE',
    schema: penaltySchema,
    meta: {
      penaltyId: id,
      errorMessage: 'Sletting av prikk feilet',
    },
    body: {},
  });
}
export function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}): Thunk<void> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: User.RESET_PASSWORD,
        endpoint: '/password-reset-perform/',
        method: 'POST',
        body: {
          token,
          password,
        },
        meta: {
          errorMessage: 'Tilbakestilling av passord feilet',
        },
      })
    );
}
