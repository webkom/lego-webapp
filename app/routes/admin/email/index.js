import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'email',
  ...resolveAsyncRoute(() => import('./components/EmailPage')),
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
      ...resolveAsyncRoute(() => import('./EditEmailListRoute'))
    },
    {
      path: 'users',
      ...resolveAsyncRoute(() => import('./EmailUsersRoute'))
    },
    {
      path: 'users/new',
      ...resolveAsyncRoute(() => import('./EmailUserRoute'))
    },
    {
      path: 'users/:emailUserId',
      ...resolveAsyncRoute(() => import('./EditEmailUserRoute'))
    },
    {
      path: 'restricted',
      ...resolveAsyncRoute(() => import('./RestrictedMailListsRoute'))
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
