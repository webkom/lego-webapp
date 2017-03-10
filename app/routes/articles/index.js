import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'articles',
  indexRoute: resolveAsyncRoute(
    () => import('./ArticleListRoute'),
    () => require('./ArticleListRoute')
  ),
  childRoutes: [{
    path: 'new',
    ...resolveAsyncRoute(
      () => import('./ArticleCreateRoute'),
      () => require('./ArticleCreateRoute')
    )
  }, {
    path: ':articleId',
    ...resolveAsyncRoute(
      () => import('./ArticleDetailRoute'),
      () => require('./ArticleDetailRoute')
    )
  }]
};
