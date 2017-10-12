import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages',
  indexRoute: resolveAsyncRoute(() => import('./PageListRoute')),
  childRoutes: [
    {
      path: ':pageSlug',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    }
  ]
};
