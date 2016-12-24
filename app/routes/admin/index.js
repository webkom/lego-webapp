import { loadRoute, loadingError } from 'app/routes';

export default {
  path: 'admin', // admin
  indexRoute: {
    getComponent(location, cb) {
      import('./OverviewRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  },
  childRoutes: [{
    path: 'groups', // admin/groups
    getComponent(location, cb) {
      import('./GroupsRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    },
    childRoutes: [{
      path: ':groupId', // admin/groups/123
      getComponent(location, cb) {
        import('./GroupDetailRoute')
          .then(loadRoute(cb))
          .catch(loadingError);
      },
      childRoutes: [{
        path: 'settings', // admin/groups/123/settings
        getComponent(location, cb) {
          import('./GroupSettingsRoute')
            .then(loadRoute(cb))
            .catch(loadingError);
        }
      }, {
        path: 'members', // admin/groups/123/members
        getComponent(location, cb) {
          import('./GroupMembersRoute')
            .then(loadRoute(cb))
            .catch(loadingError);
        }
      }]
    }]
  }]
};
