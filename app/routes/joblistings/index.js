import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'joblistings',
  indexRoute: resolveAsyncRoute(
    () => import('./JoblistingRoute'),
    () => require('./JoblistingRoute')
  ),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./JoblistingCreateRoute'),
        () => require('./JoblistingCreateRoute')
      )
    },
    {
      path: ':joblistingId/edit',
      ...resolveAsyncRoute(
        () => import('./JoblistingEditRoute'),
        () => require('./JoblistingEditRoute')
      )
    },
    {
      path: ':joblistingId',
      ...resolveAsyncRoute(
        () => import('./JoblistingDetailedRoute'),
        () => require('./JoblistingDetailedRoute')
      )
    }
  ]
};
