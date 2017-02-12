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
    path: 'new',
    getComponent(location, cb) {
      import('./ArticleCreateRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }, {
    path: ':articleId',
    getComponent(location, cb) {
      import('./ArticleDetailRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }, {
    path: ':articleId/edit',
    getComponent(location, cb) {
      import('./ArticleEditRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
};
