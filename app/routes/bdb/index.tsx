import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'bdb',
  indexRoute: resolveAsyncRoute(() => import('./BdbRoute')),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(() => import('./AddCompanyRoute'))
    },
    {
      path: ':companyId',
      ...resolveAsyncRoute(() => import('./BdbDetailRoute'))
    },
    {
      path: ':companyId/edit',
      ...resolveAsyncRoute(() => import('./EditCompanyRoute'))
    },
    {
      path: ':companyId/semesters/add',
      ...resolveAsyncRoute(() => import('./AddSemesterRoute'))
    },
    {
      path: ':companyId/company-contacts/add',
      ...resolveAsyncRoute(() => import('./AddCompanyContactRoute'))
    },
    {
      path: ':companyId/company-contacts/:companyContactId',
      ...resolveAsyncRoute(() => import('./EditCompanyContactRoute'))
    }
  ]
};
