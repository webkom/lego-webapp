import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'meetings',
  indexRoute: resolveAsyncRoute(
    () => import('./MeetingListRoute'),
    () => require('./MeetingListRoute')
  ),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./MeetingCreateRoute'),
        () => require('./MeetingCreateRoute')
      )
    },
    {
      path: ':meetingId',
      ...resolveAsyncRoute(
        () => import('./MeetingDetailRoute'),
        () => require('./MeetingDetailRoute')
      )
    },
    {
      path: ':meetingId/edit',
      ...resolveAsyncRoute(
        () => import('./MeetingEditRoute'),
        () => require('./MeetingEditRoute')
      )
    }
  ]
};
