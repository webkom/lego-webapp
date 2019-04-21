import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages/',
  component: require('./PageListRoute'),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PageCreateRoute'))
    },
    {
      path: ':section',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
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
