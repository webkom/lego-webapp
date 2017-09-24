import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'groups', // admin/groups
  ...resolveAsyncRoute(() => import('./GroupsRoute')),
  childRoutes: [
    {
      path: ':groupId', // admin/groups/123
      ...resolveAsyncRoute(() => import('./GroupDetailRoute')),
      childRoutes: [
        {
          path: 'settings', // admin/groups/123/settings
          ...resolveAsyncRoute(() => import('./GroupSettingsRoute'))
        },
        {
          path: 'members', // admin/groups/123/members
          ...resolveAsyncRoute(() => import('./components/GroupMembers'))
        }
      ]
    }
  ]
};
