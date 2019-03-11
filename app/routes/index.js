import { AppRoute } from './app';
import overview from './overview';
import events from './events';
import company from './company';
import users from './users';
import articles from './articles';
import meetings from './meetings';
import admin from './admin';
import quotes from './quotes';
import podcasts from './podcasts';
import photos from './photos';
import pages from './pages';
import search from './search';
import interestGroups from './interestgroups';
import joblistings from './joblistings';
import pageNotFound from './pageNotFound';
import announcements from './announcements';
import companyInterest from './companyInterest';
import bdb from './bdb';
import contact from './contact';
import timeline from './timeline';
import surveys from './surveys';
import tags from './tags';
import brand from './brand';
import userValidator from './userValidator';
import polls from './polls';

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
    podcasts,
    pages,
    company,
    search,
    interestGroups,
    joblistings,
    announcements,
    bdb,
    contact,
    timeline,
    ...companyInterest,
    surveys,
    tags,
    brand,
    polls,
    userValidator,
    /* 
     This will eat all routes that are written after this 
     So one cant put any routes after pageNotFound
     */
    pageNotFound
  ]
};
