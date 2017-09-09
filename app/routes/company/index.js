import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'companies',
  indexRoute: resolveAsyncRoute(
    () => import('./CompaniesRoute'),
    () => require('./CompaniesRoute')
  ),
  childRoutes: [
    {
      path: ':companyId',
      ...resolveAsyncRoute(
        () => import('./CompanyDetailRoute'),
        () => require('./CompanyDetailRoute')
      )
    }
  ]
};
