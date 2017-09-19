import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'companyInterest',
  indexRoute: resolveAsyncRoute(
    () => import('./CompanyInterestListRoute'),
    () => require('./CompanyInterestListRoute')
  ),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./CompanyInterestRoute'),
        () => require('./CompanyInterestRoute')
      )
    },
    {
      path: ':companyInterestId/edit',
      ...resolveAsyncRoute(
        () => import('./CompanyInterestEditRoute'),
        () => require('./CompanyInterestEditRoute')
      )
    }
  ]
};
