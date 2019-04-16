import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'timeline',
  indexRoute: resolveAsyncRoute(
    () => import('./TimelineRoute'),
    () => import('./TimelineRoute')
  )
};
