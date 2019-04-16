import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'joblistings',
  indexRoute: resolveAsyncRoute(() => import('./JoblistingRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./JoblistingCreateRoute'))
    },
    {
      path: ':joblistingId/edit',
      ...resolveAsyncRoute(() => import('./JoblistingEditRoute'))
    },
    {
      path: ':joblistingId',
      ...resolveAsyncRoute(() => import('./JoblistingDetailedRoute'))
    }
  ]
};
