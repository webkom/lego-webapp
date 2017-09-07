import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'email',
  ...resolveAsyncRoute(
    () => import('./EmailRoute'),
    () => require('./EmailRoute')
  ),
  childRoutes: [
    {
      path: 'restricted',
      ...resolveAsyncRoute(
        () => import('./RestrictedRoute'),
        () => require('./RestrictedRoute')
      )
    },
    {
      path: 'users',
      ...resolveAsyncRoute(
        () => import('./EmailRoute'),
        () => require('./EmailRoute')
      )
    },
    {
      path: 'groups',
      ...resolveAsyncRoute(
        () => import('./EmailRoute'),
        () => require('./EmailRoute')
      )
    },
    {
      path: 'lists',
      ...resolveAsyncRoute(
        () => import('./EmailRoute'),
        () => require('./EmailRoute')
      )
    }
  ]
};
