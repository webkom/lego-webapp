import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import groups from './groups';
import email from './email';

export default {
  path: 'admin', // admin
  ...resolveAsyncRoute(() => import('./OverviewRoute')),
  childRoutes: [groups, email]
};
