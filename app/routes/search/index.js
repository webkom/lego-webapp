import { loadRoute, loadingError } from 'app/routes';

export default ({
  path: 'search',
  indexRoute: {
    getComponent(location, cb) {
      import('./SearchRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }
});
