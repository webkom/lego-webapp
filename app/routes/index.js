import * as React from 'react';
import { Route } from 'react-router-dom';
import { AppRoute } from './app';
import Overview from './overview';
import Events from './events';
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
import RouteWrapper from 'app/components/RouteWrapper';

const old = {
  path: '/',
  component: AppRoute,
  childRoutes: [
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

const RouterConfig = () => (
  <>
    <Route path="/" component={AppWrapper} />
  </>
);

const AppWrapper = props => (
  <AppRoute {...props}>
    <RouteWrapper exact path="/" Component={Overview} />
    <Events />
  </AppRoute>
);

export default RouterConfig;
