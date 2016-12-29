import { loadRoute, loadingError } from 'app/routes';

export default {
  path: 'pages',
  childRoutes: [{
    path: ':pageSlug',
    getComponent(location, cb) {
      import('./PageDetailRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
};
