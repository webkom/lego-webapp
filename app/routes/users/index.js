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
      path: ':username',
      ...resolveAsyncRoute(
        () => import('./UserProfileRoute'),
        () => require('./UserProfileRoute')
      )
    }
  ]
};
