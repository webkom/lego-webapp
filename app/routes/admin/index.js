import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import groups from './groups';

export default {
  path: 'admin', // admin
  ...resolveAsyncRoute(
    () => import('./OverviewRoute'),
    () => require('./OverviewRoute')
  ),
  childRoutes: [groups]
};
