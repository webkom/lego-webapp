export default {
  path: 'articles',
  indexRoute: { component: require('./ArticleListRoute').default },
  childRoutes: [{
    path: ':articleId',
    component: require('./ArticleDetailRoute').default
  }]
};
