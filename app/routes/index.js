import React from 'react';
import { AppRoute } from 'app/routes/app';
import overview from 'app/routes/overview';
import events from 'app/routes/events';
import users from 'app/routes/users';
import articles from 'app/routes/articles';
import admin from 'app/routes/admin';
import quotes from 'app/routes/quotes';

export function loadRoute(callback) {
  return (module) => callback(null, module.default);
}

export function loadingError(err) {
  console.error('Loading error', err); // eslint-disable-line
}

export default {
  path: '/',
  component: AppRoute,
  indexRoute: overview,
  childRoutes: [
    events,
    users,
    articles,
    admin,
    quotes,
    {
      path: '*',
      component: () => <div>Not Found</div>
    }
  ]
};
