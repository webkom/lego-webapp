import { loadRoute, loadingError } from 'app/routes';

export default {
  path: 'articles',
  indexRoute: {
    getComponent(location, cb) {
      import('./ArticleListRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  },
  childRoutes: [{
    path: ':articleId',
    getComponent(location, cb) {
      import('./ArticleDetailRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
};
