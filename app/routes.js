import React from 'react';
import Root from './Root';
import overview from './routes/overview';
import events from './routes/events';
import users from './routes/users';
import admin from './routes/admin';
import quotes from './routes/quotes';

export default {
  path: '/',
  component: Root,
  indexRoute: overview,
  childRoutes: [
    events,
    users,
    admin,
    quotes,
    {
      path: '*',
      component: () => <div>Not Found</div>
    }
  ]
};
