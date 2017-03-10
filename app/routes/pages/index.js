import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages',
  childRoutes: [{
    path: ':pageSlug',
    ...resolveAsyncRoute(
      () => import('./PageDetailRoute'),
      () => require('./PageDetailRoute')
    )
  }]
};
