import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'announcements',
  indexRoute: resolveAsyncRoute(
    () => import('./AnnouncementsRoute'),
    () => require('./AnnouncementsRoute')
  )
};
