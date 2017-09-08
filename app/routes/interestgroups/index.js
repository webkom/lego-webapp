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
      component: require('./InterestGroupDetailRoute').default,
      childRoutes: [
        {
          path: 'edit',
          component: require('./InterestGroupEditRoute').default
        }
      ]
    }
  ]
};
