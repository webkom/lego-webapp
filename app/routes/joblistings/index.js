import { loadRoute, loadingError } from 'app/routes';

export default {
  path: 'joblistings',
  indexRoute: {
    getComponent(location, cb) {
      import('./JoblistingsRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    },
  },
  childRoutes: [{
    path: ':joblistingId',
    getComponent(location, cb) {
      import('./JoblistingsDetailedRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
};
