import Root from './Root';
import overview from './routes/overview';
import events from './routes/events';
import users from './routes/users';
import admin from './routes/admin';

export default {
  path: '/',
  component: Root,
  indexRoute: overview,
  childRoutes: [
    events,
    users,
    admin
  ]
};
