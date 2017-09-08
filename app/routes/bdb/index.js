import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'bdb',
  indexRoute: resolveAsyncRoute(
    () => import('./BdbRoute'),
    () => require('./BdbRoute')
  ),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(
        () => import('./AddCompanyRoute'),
        () => require('./AddCompanyRoute')
      )
    },
    {
      path: ':companyId',
      ...resolveAsyncRoute(
        () => import('./BdbDetailRoute'),
        () => require('./BdbDetailRoute')
      )
    },
    {
      path: ':companyId/edit',
      ...resolveAsyncRoute(
        () => import('./EditCompanyRoute'),
        () => require('./EditCompanyRoute')
      )
    },
    {
      path: ':companyId/semesters/add',
      ...resolveAsyncRoute(
        () => import('./AddSemesterRoute'),
        () => require('./AddSemesterRoute')
      )
    },
    {
      path: ':companyId/semesters/:semesterId',
      ...resolveAsyncRoute(
        () => import('./EditSemesterRoute'),
        () => require('./EditSemesterRoute')
      )
    },
    {
      path: ':companyId/company-contacts/add',
      ...resolveAsyncRoute(
        () => import('./AddCompanyContactRoute'),
        () => require('./AddCompanyContactRoute')
      )
    },
    {
      path: ':companyId/company-contacts/:companyContactId',
      ...resolveAsyncRoute(
        () => import('./EditCompanyContactRoute'),
        () => require('./EditCompanyContactRoute')
      )
    }
  ]
};
