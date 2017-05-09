export default {
  path: 'users',
  childRoutes: [
    {
      path: 'me',
      component: require('./UserProfileRoute').default
    },
    {
      path: 'me/settings',
      component: require('./UserSettingsRoute').default
    },
    {
      path: 'me/settings/notifications',
      component: require('./UserSettingsNotificationsRoute').default
    },
    {
      path: 'me/settings/oauth2',
      component: require('./UserSettingsOAuth2Route').default
    },
    {
      path: ':username',
      component: require('./UserProfileRoute').default
    }
  ]
};
