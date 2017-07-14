import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages',
  indexRoute: resolveAsyncRoute(() => import('./PageListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(
        () => import('./PageCreateRoute'),
        () => require('./PageCreateRoute')
      )
    },
    {
      path: ':pageSlug/edit',
      ...resolveAsyncRoute(
        () => import('./PageEditRoute'),
        () => require('./PageEditRoute')
      )
    },
    {
      path: ':pageSlug',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    }
  ]
};
