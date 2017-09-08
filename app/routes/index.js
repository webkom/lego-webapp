import { AppRoute } from './app';
import overview from './overview';
import events from './events';
import company from './company';
import email from './email';
import users from './users';
import articles from './articles';
import meetings from './meetings';
import admin from './admin';
import quotes from './quotes';
import photos from './photos';
import pages from './pages';
import search from './search';
import interestGroups from './interestgroups';
import joblistings from './joblistings';
import HTTPError from './errors';
import announcements from './announcements';
import bdb from './bdb';

export default {
  path: '/',
  component: AppRoute,
  indexRoute: overview,
  childRoutes: [
    events,
    users,
    articles,
    photos,
    meetings,
    admin,
    quotes,
    pages,
    company,
    search,
    interestGroups,
    joblistings,
    announcements,
    bdb,
    email,
    {
      path: '*',
      component: HTTPError
    }
  ]
};
