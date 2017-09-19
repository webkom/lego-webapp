import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'interestgroups',
  indexRoute: resolveAsyncRoute(
    () => import('./InterestGroupListRoute'),
    () => require('./InterestGroupListRoute')
  ),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./InterestGroupCreateRoute'),
        () => require('./InterestGroupCreateRoute')
      )
    },
    {
      path: ':interestGroupId',
      ...resolveAsyncRoute(
        () => import('./InterestGroupDetailRoute'),
        () => require('./InterestGroupDetailRoute')
      )
    },
    {
      path: ':interestGroupId/edit',
      ...resolveAsyncRoute(
        () => import('./InterestGroupEditRoute'),
        () => require('./InterestGroupEditRoute')
      )
    }
  ]
};
