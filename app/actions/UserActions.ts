import { push } from 'connected-react-router';
import cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import moment from 'moment-timezone';
import { normalize } from 'normalizr';
import config from 'app/config';
import type { AddPenalty, ID, PhotoConsent } from 'app/models';
import { logout as logoutAction } from 'app/reducers/auth';
import { setStatusCode } from 'app/reducers/routing';
import type Entities from 'app/store/models/Entities';
import type { EntityType } from 'app/store/models/Entities';
import type { MeUser } from 'app/store/models/User';
import type User from 'app/store/models/User';
import { userSchema, penaltySchema } from 'app/store/schemas';
import type { AppDispatch, AppThunk } from 'app/store/store';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';
import type { Token, EncodedToken, GetCookie } from 'app/types';
import { FetchHistory } from './ActionTypes';
import { uploadFile } from './FileActions';
import { fetchMeta } from './MetaActions';

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

function getToken(getCookie: GetCookie): Token | void {
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

interface LoginSuccessPayload {
  token: EncodedToken;
  user?: MeUser;
}

export const login = createLegoApiAction<LoginSuccessPayload>()(
  'User.LOGIN',
  (_, username: string, password: string) => ({
    endpoint: '//authorization/token-auth/',
    method: 'POST',
    body: {
      username,
      password,
    },
    meta: {
      errorMessage: 'Kunne ikke logge inn',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      saveToken(token);
      dispatch({
        type: FetchHistory.CLEAR_HISTORY,
      });
      dispatch(fetchMeta());
      dispatch(setStatusCode(null));
      return dispatch(
        fetchUser.success({
          payload: normalize(user, userSchema),
          meta: {
            isCurrentUser: true,
            errorMessage: '',
          },
        })
      );
    },
  }
);

export const logoutWithRedirect = (): AppThunk<void> => (dispatch) => {
  dispatch(logout());
  dispatch(push('/'));
};

export const logout = (): AppThunk<void> => (dispatch) => {
  removeToken();
  dispatch(logoutAction);
  dispatch(fetchMeta());
};

interface UpdateUserSuccessPayload {
  entities: Pick<Entities, EntityType.Users | EntityType.Groups>;
  result: ID;
}

export const updateUser = createLegoApiAction<UpdateUserSuccessPayload>()(
  'User.UPDATE',
  (
    _,
    user: Partial<MeUser>,
    options: {
      noRedirect: boolean;
      updateProfilePicture?: boolean;
    } = {
      noRedirect: false,
      updateProfilePicture: false,
    }
  ) => {
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
    } = user;
    return {
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
        noRedirect: options.noRedirect,
        username,
      },
    };
  },
  {
    onSuccess: (action, dispatch) => {
      if (!action || !action.payload) return;

      if (!action.meta.noRedirect) {
        dispatch(push(`/users/${action.meta.username}`));
      }
    },
  }
);

type PasswordPayload = {
  password: string;
  newPassword: string;
  retypeNewPassword: string;
};

export const changePassword = createLegoApiAction<[]>()(
  'User.PASSWORD_CHANGE',
  (_, data: PasswordPayload) => ({
    endpoint: '/password-change/',
    method: 'POST',
    body: data,
    schema: userSchema,
    meta: {
      errorMessage: 'Oppdatering av passord feilet',
      successMessage: 'Passordet ble endret',
    },
  })
);

export const changeGrade = createLegoApiAction<UpdateUserSuccessPayload>()(
  'User.GRADE_CHANGE',
  (_, groupId: ID, username: string) => ({
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
  })
);

export const removePicture = createLegoApiAction<UpdateUserSuccessPayload>()(
  'User.REMOVE_PICTURE',
  (_, username: string) => ({
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

export const updatePhotoConsent =
  createLegoApiAction<UpdateUserSuccessPayload>()(
    'User.UPDATE_PHOTO_CONSENT',
    (_, photoConsent: PhotoConsent, username: string, userId: number) => {
      const { year, semester, domain, isConsenting } = photoConsent;
      return {
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
      };
    }
  );

export function updatePicture({
  username,
  picture,
}: {
  picture: File;
  username: string;
}) {
  return async (dispatch: AppDispatch) => {
    const uploadPictureAction = await dispatch(
      uploadFile({
        file: picture,
      })
    );
    return dispatch(
      updateUser(
        {
          username,
          profilePicture: uploadPictureAction?.meta?.fileToken,
        },
        {
          noRedirect: true,
          updateProfilePicture: true,
        }
      )
    );
  };
}

export const fetchUser = createLegoApiAction<
  LegoApiSuccessPayload<EntityType.Users>
>()('User.FETCH', (_, username = 'me') => ({
  endpoint: `/users/${username}/`,
  schema: userSchema,
  useCache: false,
  meta: {
    errorMessage: 'Henting av bruker feilet',
    isCurrentUser: username === 'me',
  },
  propagateError: true,
}));

export const refreshToken = createLegoApiAction<{ token: EncodedToken }>()(
  'User.REFRESH_TOKEN',
  (_, token: EncodedToken) => ({
    endpoint: '//authorization/token-auth/refresh/',
    method: 'POST',
    body: {
      token,
    },
  })
);

export function loginWithExistingToken(token: Token) {
  return (dispatch: AppDispatch) => {
    const now = moment();
    const expirationTime = moment.unix(token.exp);

    if (now.isAfter(expirationTime)) {
      removeToken();
      return Promise.resolve();
    }

    dispatch(
      login.success({
        payload: {
          token: token.encodedToken,
        },
        meta: {
          errorMessage: '',
        },
      })
    );
    return dispatch(fetchUser());
  };
}

/**
 * Refreshes the token if it was issued any other day than today.
 */
export function maybeRefreshToken(): AppThunk<Promise<unknown>> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);
    if (!token) return Promise.resolve();
    const issuedTime = moment.unix(token.orig_iat);

    if (!issuedTime.isSame(moment(), 'day')) {
      return dispatch(refreshToken(token.encodedToken))
        .then((action) => saveToken(action.payload.token))
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
export function loginAutomaticallyIfPossible(): AppThunk<Promise<unknown>> {
  return (dispatch, getState, { getCookie }) => {
    const token = getToken(getCookie);

    if (!token) {
      return Promise.resolve();
    }

    return dispatch(loginWithExistingToken(token));
  };
}

type SendRegistrationEmailArgs = {
  email: string;
  captchaResponse: string;
};
export const sendRegistrationEmail = createLegoApiAction()(
  'User.SEND_REGISTRATION_TOKEN',
  (_, { email, captchaResponse }: SendRegistrationEmailArgs) => ({
    endpoint: '/users-registration-request/',
    method: 'POST',
    body: {
      email,
      captchaResponse,
    },
    meta: {
      errorMessage: 'Sending av registrerings-epost feilet',
    },
  })
);

export const validateRegistrationToken = createLegoApiAction()(
  'User.VALIDATE_REGISTRATION_TOKEN',
  (_, token: string) => ({
    endpoint: `/users-registration-request/?token=${token}`,
    meta: {
      errorMessage: 'Validering av registrerings-token feilet',
      token,
    },
  })
);

interface CreateUserSuccessPayload {
  user: User;
  token: EncodedToken;
}

export const createUser = createLegoApiAction<CreateUserSuccessPayload>()(
  'User.CREATE_USER',
  (_, token: string, user: string) => ({
    endpoint: `/users/?token=${token}`,
    method: 'POST',
    body: user,
    meta: {
      errorMessage: 'Opprettelse av bruker feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      if (!action || !action.payload) return;
      const { user, token } = action.payload;
      saveToken(token);
      return dispatch(
        fetchUser.success({
          payload: normalize(user, userSchema),
          meta: {
            isCurrentUser: true,
            errorMessage: '',
          },
        })
      );
    },
  }
);

export const deleteUser = createLegoApiAction()(
  'User.DELETE',
  (_, password: string) => ({
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

export const sendStudentConfirmationEmail = createLegoApiAction()(
  'User.SEND_STUDENT_CONFIRMATION_EMAIL',
  // TODO: I don't think this user is supposed to be a string
  (_, user: string) => ({
    endpoint: `/users-student-confirmation-request/`,
    method: 'POST',
    body: user,
    meta: {
      errorMessage: 'Sending av student bekreftelsesepost feilet',
    },
  })
);

export const confirmStudentUser = createLegoApiAction()(
  'User.CONFIRM_STUDENT_USER',
  (_, token: string) => ({
    endpoint: `/users-student-confirmation-perform/?token=${token}`,
    method: 'POST',
    meta: {
      errorMessage: 'Student bekreftelse feilet',
    },
    useCache: true,
  })
);

export const sendForgotPasswordEmail = createLegoApiAction()(
  'User.SEND_FORGOT_PASSWORD_EMAIL',
  (
    _,
    {
      email,
    }: {
      email: string;
    }
  ) => ({
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

export const addPenalty = createLegoApiAction()(
  'Penalty.CREATE',
  (_, { user, reason, weight, sourceEvent }: AddPenalty) => ({
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
  })
);

export const deletePenalty = createLegoApiAction()(
  'Penalty.DELETE',
  (_, id: number) => ({
    endpoint: `/penalties/${id}/`,
    method: 'DELETE',
    schema: penaltySchema,
    meta: {
      penaltyId: id,
      errorMessage: 'Sletting av prikk feilet',
    },
    body: {},
  })
);

interface ResetPasswordArgs {
  token: string;
  password: string;
}

export const resetPassword = createLegoApiAction()(
  'User.RESET_PASSWORD',
  (_, { token, password }: ResetPasswordArgs) => ({
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
