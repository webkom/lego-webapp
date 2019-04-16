import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default [
  {
    path: 'interesse',
    ...resolveAsyncRoute(() => import('./CompanyInterestRoute'))
  },
  {
    path: 'register-interest',
    ...resolveAsyncRoute(() => import('./CompanyInterestRoute'))
  },
  {
    path: 'companyInterest',
    indexRoute: resolveAsyncRoute(() => import('./CompanyInterestListRoute')),
    childRoutes: [
      {
        path: 'create',
        ...resolveAsyncRoute(() => import('./CompanyInterestRoute'))
      },
      {
        path: 'semesters',
        ...resolveAsyncRoute(() => import('./CompanySemesterGUIRoute'))
      },
      {
        path: ':companyInterestId/edit',
        ...resolveAsyncRoute(() => import('./CompanyInterestEditRoute'))
      }
    ]
  }
];
