import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'events',
  indexRoute: resolveAsyncRoute(
    () => import('./EventListRoute'),
    () => require('./EventListRoute')
  ),
  childRoutes: [{
    path: 'calendar',
    ...resolveAsyncRoute(
      () => import('./CalendarRoute'),
      () => require('./CalendarRoute')
    ),
    childRoutes: [{
      path: ':year',
      childRoutes: [{
        path: ':month'
      }]
    }]
  }, {
    path: ':eventId',
    ...resolveAsyncRoute(
      () => import('./EventDetailRoute'),
      () => require('./EventDetailRoute')
    ),
  }]
};
