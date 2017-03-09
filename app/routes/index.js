import { AppRoute } from './app';
import overview from './overview';
import events from './events';
import company from './company';
import users from './users';
import articles from './articles';
import meetings from './meetings';
import admin from './admin';
import quotes from './quotes';
import pages from './pages';
import search from './search';
import slack from './slack';
import interestGroups from './interestgroups';
import joblistings from './joblistings';
import NotFound from './errors/NotFound';

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
    company,
    search,
    slack,
    interestGroups,
    joblistings,
    {
      path: '*',
      component: NotFound
    }
  ]
};
