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
        () => import('./components/UserSettingsIndex'),
        () => require('./components/UserSettingsIndex')
      ),
      childRoutes: [
        {
          path: 'profile',
          ...resolveAsyncRoute(
            () => import('./UserSettingsRoute'),
            () => require('./UserSettingsRoute')
          )
        },
        {
          path: 'notifications',
          ...resolveAsyncRoute(
            () => import('./UserSettingsNotificationsRoute'),
            () => require('./UserSettingsNotificationsRoute')
          )
        },
        {
          path: 'oauth2',
          ...resolveAsyncRoute(
            () => import('./UserSettingsOAuth2Route'),
            () => require('./UserSettingsOAuth2Route')
          )
        },
        {
          path: 'oauth2/new',
          ...resolveAsyncRoute(
            () => import('./UserSettingsOAuth2CreateRoute'),
            () => require('./UserSettingsOAuth2CreateRoute')
          )
        },
        {
          path: 'oauth2/:applicationId',
          ...resolveAsyncRoute(
            () => import('./UserSettingsOAuth2EditRoute'),
            () => require('./UserSettingsOAuth2EditRoute')
          )
        },
        {
          path: 'student-confirmation',
          ...resolveAsyncRoute(
            () => import('./StudentConfirmationRoute'),
            () => require('./StudentConfirmationRoute')
          )
        }
      ]
    },
    {
      path: 'registration',
      ...resolveAsyncRoute(
        () => import('./UserConfirmationRoute'),
        () => require('./UserConfirmationRoute')
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
