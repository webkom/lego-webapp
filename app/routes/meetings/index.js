import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'meetings',
  indexRoute: resolveAsyncRoute(() => import('./MeetingListRoute')),
  childRoutes: [
    {
      path: 'create',
      ...resolveAsyncRoute(() => import('./MeetingCreateRoute'))
    },
    {
      path: ':meetingId',
      ...resolveAsyncRoute(() => import('./MeetingDetailRoute'))
    },
    {
      path: ':meetingId/edit',
      ...resolveAsyncRoute(() => import('./MeetingEditRoute'))
    }
  ]
};
