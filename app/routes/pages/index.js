import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages/',
  indexRoute: resolveAsyncRoute(() => import('./PageListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PageCreateRoute'))
    },
    {
      path: ':section/:pageSlug/edit',
      ...resolveAsyncRoute(() => import('./PageEditRoute'))
    },
    {
      path: ':section/:pageSlug',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    }
  ]
};
