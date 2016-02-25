export default {
  path: 'admin', // admin
  indexRoute: {
    component: require('./OverviewRoute').default
  },
  childRoutes: [{
    path: 'groups', // admin/groups
    component: require('./GroupsRoute').default,
    childRoutes: [{
      path: ':groupId', // admin/groups/123
      component: require('./GroupDetailRoute').default,
      childRoutes: [{
        path: 'settings', // admin/groups/123/settings
        component: require('./GroupSettingsRoute').default
      }, {
        path: 'members', // admin/groups/123/members
        component: require('./GroupMembersRoute').default
      }]
    }]
  }]
};
