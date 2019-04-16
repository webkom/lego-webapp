import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'interestgroups',
  indexRoute: resolveAsyncRoute(() => import('./InterestGroupListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./InterestGroupCreateRoute'))
    },
    {
      path: ':interestGroupId',
      ...resolveAsyncRoute(() => import('./InterestGroupDetailRoute'))
    },
    {
      path: ':interestGroupId/edit',
      ...resolveAsyncRoute(() => import('./InterestGroupEditRoute'))
    }
  ]
};
