import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'users',
  indexRoute: resolveAsyncRoute(() => import('../errors')),
  childRoutes: [
    {
      path: 'registration',
      ...resolveAsyncRoute(() => import('./UserConfirmationRoute'))
    },
    {
      path: 'reset-password',
      ...resolveAsyncRoute(() => import('./UserResetPasswordRoute'))
    },
    {
      path: ':username',
      ...resolveAsyncRoute(() => import('./UserProfileRoute'))
    },
    {
      path: ':username/settings',
      ...resolveAsyncRoute(() => import('./components/UserSettingsIndex')),
      childRoutes: [
        {
          path: 'profile',
          ...resolveAsyncRoute(() => import('./UserSettingsRoute'))
        },
        {
          path: 'notifications',
          ...resolveAsyncRoute(() => import('./UserSettingsNotificationsRoute'))
        },
        {
          path: 'oauth2',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2Route'))
        },
        {
          path: 'oauth2/new',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2CreateRoute'))
        },
        {
          path: 'oauth2/:applicationId',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2EditRoute'))
        },
        {
          path: 'student-confirmation',
          ...resolveAsyncRoute(() => import('./StudentConfirmationRoute'))
        }
      ]
    }
  ]
};
