import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'admin', // admin
  indexRoute: resolveAsyncRoute(
    () => import('./OverviewRoute'),
    () => require('./OverviewRoute')
  ),
  childRoutes: [
    {
      path: 'groups', // admin/groups
      ...resolveAsyncRoute(
        () => import('./GroupsRoute'),
        () => require('./GroupsRoute')
      ),
      childRoutes: [
        {
          path: ':groupId', // admin/groups/123
          ...resolveAsyncRoute(
            () => import('./GroupDetailRoute'),
            () => require('./GroupDetailRoute')
          ),
          childRoutes: [
            {
              path: 'settings', // admin/groups/123/settings
              ...resolveAsyncRoute(
                () => import('./GroupSettingsRoute'),
                () => require('./GroupSettingsRoute')
              )
            },
            {
              path: 'members', // admin/groups/123/members
              ...resolveAsyncRoute(
                () => import('./GroupMembersRoute'),
                () => require('./GroupMembersRoute')
              )
            }
          ]
        }
      ]
    }
  ]
};
