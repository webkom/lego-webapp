import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'joblistings',
  indexRoute: resolveAsyncRoute(
    () => import('./JoblistingsRoute'),
    () => require('./JoblistingsRoute')
  ),
  childRoutes: [
    {
      path: ':joblistingId',
      ...resolveAsyncRoute(
        () => import('./JoblistingsDetailedRoute'),
        () => require('./JoblistingsDetailedRoute')
      )
    }
  ]
};
