import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'articles',
  indexRoute: resolveAsyncRoute(() => import('./ArticleListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./ArticleCreateRoute'))
    },
    {
      path: ':articleId',
      ...resolveAsyncRoute(() => import('./ArticleDetailRoute'))
    },
    {
      path: ':articleId/edit',
      ...resolveAsyncRoute(() => import('./ArticleEditRoute'))
    }
  ]
};
