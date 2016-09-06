import React from 'react';
import { AppRoute } from './app';
import overview from './overview';
import events from './events';
import users from './users';
import articles from './articles';
import meetings from './meetings';
import admin from './admin';
import quotes from './quotes';
import pages from './pages';
import search from './search';
import joblistings from './joblistings';

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
    meetings,
    admin,
    quotes,
    pages,
    search,
    joblistings,
    {
      path: '*',
      component: () => <div>Not Found</div>
    }
  ]
};
