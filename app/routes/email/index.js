import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'email',
  ...resolveAsyncRoute(() => import('./EmailRoute')),
  childRoutes: [
    {
      path: 'restricted',
      ...resolveAsyncRoute(() => import('./RestrictedRoute'))
    },
    {
      path: 'users',
      ...resolveAsyncRoute(() => import('./EmailRoute'))
    },
    {
      path: 'groups',
      ...resolveAsyncRoute(() => import('./EmailRoute'))
    },
    {
      path: 'lists',
      ...resolveAsyncRoute(() => import('./EmailRoute'))
    }
  ]
};
