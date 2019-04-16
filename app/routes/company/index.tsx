import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'companies',
  indexRoute: resolveAsyncRoute(() => import('./CompaniesRoute')),
  childRoutes: [
    {
      path: ':companyId',
      ...resolveAsyncRoute(() => import('./CompanyDetailRoute'))
    }
  ]
};
