// @flow
import { loadRoute, loadingError } from 'app/routes';

export default ({
  path: 'slack',
  indexRoute: {
    getComponent(location, cb) {
      import('./SlackRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }
});
