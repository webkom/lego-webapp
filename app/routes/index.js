import React from 'react';
import { AppRoute } from './app';
import overview from './overview';
import events from './events';
import users from './users';
import articles from './articles';
import admin from './admin';
import quotes from './quotes';
import pages from './pages';
import search from './search';

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
    pages,
    search,
    {
      path: '*',
      component: () => <div>Not Found</div>
    }
  ]
};
