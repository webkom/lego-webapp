import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';
import lendingRoute from 'app/routes/lending';
import adminRoute from './admin';
import announcementsRoute from './announcements';
import { AppRoute } from './app';
import articlesRoute from './articles';
import bdbRoute from './bdb';
import brandRoute from './brand';
import companyRoute from './company';
import companyInterestRoute from './companyInterest';
import contactRoute from './contact';
import eventsRoute from './events';
import forumRoute from './forum';
import interestGroupsRoute from './interestgroups';
import joblistingsRoute from './joblistings';
import meetingsRoute from './meetings';
import pageNotFound from './pageNotFound';
import pagesRoute from './pages';
import photosRoute from './photos';
import pollsRoute from './polls';
import quotesRoute from './quotes';
import searchRoute from './search';
import surveysRoute from './surveys';
import tagsRoute from './tags';
import timelineRoute from './timeline';
import validatorRoute from './userValidator';
import usersRoute from './users';

const CompanyInterestPage = loadable(
  () => import('./companyInterest/components/CompanyInterestPage'),
);
const Frontpage = loadable(() => import('./frontpage'));

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { index: true, Component: Frontpage },
      { path: 'admin/*', children: adminRoute },
      { path: 'announcements/*', children: announcementsRoute },
      { path: 'articles/*', children: articlesRoute },
      { path: 'bdb/*', children: bdbRoute },
      { path: 'brand/*', children: brandRoute },
      { path: 'companies/*', children: companyRoute },
      { path: 'register-interest', Component: CompanyInterestPage },
      { path: 'interesse', Component: CompanyInterestPage },
      { path: 'companyInterest/*', children: companyInterestRoute },
      { path: 'company-interest/*', children: companyInterestRoute },
      { path: 'contact', children: contactRoute },
      { path: 'kontakt', children: contactRoute },
      { path: 'events/*', children: eventsRoute },
      { path: 'forum/*', children: forumRoute },
      { path: 'interest-groups/*', children: interestGroupsRoute },
      { path: 'interestgroups/*', children: interestGroupsRoute },
      { path: 'joblistings/*', children: joblistingsRoute },
      { path: 'lending/*', children: lendingRoute },
      { path: 'meetings/*', children: meetingsRoute },
      { path: 'pages/*', children: pagesRoute },
      { path: 'photos/*', children: photosRoute },
      { path: 'polls/*', children: pollsRoute },
      { path: 'quotes/*', children: quotesRoute },
      { path: 'search', children: searchRoute },
      { path: 'surveys/*', children: surveysRoute },
      { path: 'tags/*', children: tagsRoute },
      { path: 'timeline', children: timelineRoute },
      { path: 'validator', children: validatorRoute },
      { path: 'users/*', children: usersRoute },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
