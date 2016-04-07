export default {
  path: 'users',
  childRoutes: [{
    path: 'me',
    component: require('./UserProfileRoute').default
  }, {
    path: 'me/settings',
    component: require('./UserSettingsRoute').default
  }, {
    path: ':username',
    component: require('./UserProfileRoute').default
  }]
};
