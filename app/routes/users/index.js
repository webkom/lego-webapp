import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'users',
  childRoutes: [
    {
      path: 'me',
      ...resolveAsyncRoute(
        () => import('./UserProfileRoute'),
        () => require('./UserProfileRoute')
      )
    },
    {
      path: 'me/settings',
      ...resolveAsyncRoute(
        () => import('./UserSettingsRoute'),
        () => require('./UserSettingsRoute')
      )
    },
    {
      path: 'me/settings/notifications',
      ...resolveAsyncRoute(
        () => import('./UserSettingsNotificationsRoute'),
        () => require('./UserSettingsNotificationsRoute')
      )
    },
    {
      path: 'me/settings/oauth2',
      ...resolveAsyncRoute(
        () => import('./UserSettingsOAuth2Route'),
        () => require('./UserSettingsOAuth2Route')
      )
    },
    {
      path: 'me/settings/oauth2/new',
      ...resolveAsyncRoute(
        () => import('./UserSettingsOAuth2CreateRoute'),
        () => require('./UserSettingsOAuth2CreateRoute')
      )
    },
    {
      path: 'me/settings/oauth2/:applicationId',
      ...resolveAsyncRoute(
        () => import('./UserSettingsOAuth2EditRoute'),
        () => require('./UserSettingsOAuth2EditRoute')
      )
    },
    {
      path: 'registration',
      ...resolveAsyncRoute(
        () => import('./UserConfirmationRoute'),
        () => require('./UserConfirmationRoute')
      )
    },
    {
      path: 'student-confirmation',
      ...resolveAsyncRoute(
        () => import('./StudentConfirmationRoute'),
        () => require('./StudentConfirmationRoute')
      )
    },
    {
      path: ':username',
      ...resolveAsyncRoute(
        () => import('./UserProfileRoute'),
        () => require('./UserProfileRoute')
      )
    }
  ]
};
