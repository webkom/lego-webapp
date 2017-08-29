import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'joblistings',
  indexRoute: resolveAsyncRoute(
    () => import('./JoblistingsRoute'),
    () => require('./JoblistingsRoute')
  ),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./JoblistingCreateRoute'),
        () => require('./JoblistingCreateRoute')
      )
    }, {
      path: ':joblistingId/edit',
      ...resolveAsyncRoute(
        () => import('./JoblistingEditRoute'),
        () => require('./JoblistingEditRoute')
      )
    }, {
      path: ':joblistingId',
      ...resolveAsyncRoute(
        () => import('./JoblistingsDetailedRoute'),
        () => require('./JoblistingsDetailedRoute')
      )
    }
  ]
};
