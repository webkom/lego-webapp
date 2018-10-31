import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pinned',
  indexRoute: resolveAsyncRoute(() => import('./PinnedListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./PinnedCreateRoute'))
    },
    {
      path: ':pinnedId/edit',
      ...resolveAsyncRoute(() => import('./PinnedEditRoute'))
    }
  ]
};
