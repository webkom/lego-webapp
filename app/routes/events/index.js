import { loadRoute, loadingError } from 'app/routes';

export default ({
  path: 'events',
  indexRoute: {
    getComponent(location, cb) {
      import('./EventListRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  },
  childRoutes: [{
    path: 'calendar',
    getComponent(location, cb) {
      import('./CalendarRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }, {
    path: ':eventId',
    getComponent(location, cb) {
      import('./EventDetailRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
});
