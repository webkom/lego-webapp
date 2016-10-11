export default {
  path: 'articles',
  indexRoute: { component: require('./ArticleListRoute').default },
  childRoutes: [{
    path: 'edit/:articleId',
    component: require('./ArticleEditRoute').default
  }, {
    path: ':articleId',
    component: require('./ArticleDetailRoute').default
  }]
};
