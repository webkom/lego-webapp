import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'polls',
  indexRoute: resolveAsyncRoute(() => import('./PollsListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PollsCreateRoute'))
    },
    {
      path: ':pollsId',
      ...resolveAsyncRoute(() => import('./PollsDetailRoute'))
    }
  ]
};
