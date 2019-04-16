import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'groups', // admin/groups
  indexRoute: resolveAsyncRoute(() => import('./components/SelectGroup')),
  ...resolveAsyncRoute(() => import('./GroupsRoute')),
  childRoutes: [
    {
      path: ':groupId', // admin/groups/123
      ...resolveAsyncRoute(() => import('./GroupDetailRoute')),
      childRoutes: [
        {
          path: 'settings', // admin/groups/123/settings
          ...resolveAsyncRoute(() => import('./components/GroupSettings'))
        },
        {
          path: 'members', // admin/groups/123/members
          ...resolveAsyncRoute(() => import('./components/GroupMembers'))
        },
        {
          path: 'permissions', // admin/groups/123/members
          ...resolveAsyncRoute(() => import('./components/GroupPermissions'))
        }
      ]
    }
  ]
};
