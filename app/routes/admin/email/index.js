import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'email',
  ...resolveAsyncRoute(() => import('./components/EmailRoute')),
  childRoutes: [
    {
      path: 'lists',
      ...resolveAsyncRoute(() => import('./EmailListsRoute'))
    },
    {
      path: 'lists/new',
      ...resolveAsyncRoute(() => import('./CreateEmailListRoute'))
    },
    {
      path: 'lists/:emailListId',
      ...resolveAsyncRoute(() => import('./EmailListRoute'))
    },
    {
      path: 'users',
      ...resolveAsyncRoute(() => import('./EmailUsersRoute'))
    },
    {
      path: 'users/new',
      ...resolveAsyncRoute(() => import('./CreateEmailUserRoute'))
    },
    {
      path: 'users/:emailUserId',
      ...resolveAsyncRoute(() => import('./EmailUserRoute'))
    },
    {
      path: 'restricted',
      ...resolveAsyncRoute(() => import('./RestrictedMailsRoute'))
    },
    {
      path: 'restricted/new',
      ...resolveAsyncRoute(() => import('./CreateRestrictedMailRoute'))
    },
    {
      path: 'restricted/:restrictedMailId',
      ...resolveAsyncRoute(() => import('./RestrictedMailRoute'))
    }
  ]
};
