import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'email', // admin/email
  ...resolveAsyncRoute(() => import('./components/EmailPage')),
  childRoutes: [
    {
      path: 'lists', // admin/email/lists
      ...resolveAsyncRoute(() => import('./EmailListsRoute'))
    },
    {
      path: 'lists/new', // admin/email/lists/new
      ...resolveAsyncRoute(() => import('./CreateEmailListRoute'))
    },
    {
      path: 'lists/:emailListId', // admin/email/lists/12
      ...resolveAsyncRoute(() => import('./EditEmailListRoute'))
    },
    {
      path: 'users', // admin/email/users
      ...resolveAsyncRoute(() => import('./EmailUsersRoute'))
    },
    {
      path: 'users/new', // admin/email/users
      ...resolveAsyncRoute(() => import('./EmailUserRoute'))
    },
    {
      path: 'users/:emailUserId', // admin/email/users
      ...resolveAsyncRoute(() => import('./EditEmailUserRoute'))
    },
    {
      path: 'restricted', // admin/email/lists/new
      ...resolveAsyncRoute(() => import('./RestrictedMailListsRoute'))
    },
    {
      path: 'restricted/new', // admin/email/lists/new
      ...resolveAsyncRoute(() => import('./CreateRestrictedMailRoute'))
    },
    {
      path: 'restricted/:restrictedMailId', // admin/email/lists/new
      ...resolveAsyncRoute(() => import('./RestrictedMailRoute'))
    }
  ]
};
