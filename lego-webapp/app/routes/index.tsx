import { type RouteObject } from 'react-router';
import lendingRoute from 'app/routes/lending';
import { lazyComponent } from '~/utils/lazyComponent';
import achievementRoute from '../../pages/(migrated)/achievements';
import adminRoute from './admin';
import announcementsRoute from './announcements';
import { AppRoute } from './app';
import articlesRoute from './articles';
import authRoute from './auth';
import bdbRoute from './bdb';
import brandRoute from './brand';
import companyRoute from './company';
import contactRoute from './contact';
import forumRoute from './forum';
import hiddenAdminRoute from './hiddenAdmin';
import interestGroupsRoute from './interestgroups';
import meetingsRoute from './meetings';
import pageNotFound from './pageNotFound';
import photosRoute from './photos';
import pollsRoute from './polls';
import quotesRoute from './quotes';
import searchRoute from './search';
import surveysRoute from './surveys';
import tagsRoute from './tags';
import timelineRoute from './timeline';
import validatorRoute from './userValidator';

const CompanyInterestPage = lazyComponent(
  () =>
    import('./bdb/components/companyInterest/components/CompanyInterestPage'),
);

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { path: 'achievements/*', children: achievementRoute },
      { path: 'admin/*', children: adminRoute },
      { path: 'announcements/*', children: announcementsRoute },
      { path: 'articles/*', children: articlesRoute },
      { path: 'auth/*', children: authRoute },
      { path: 'bdb/*', children: bdbRoute },
      { path: 'brand/*', children: brandRoute },
      { path: 'companies/*', children: companyRoute },
      { path: 'register-interest', lazy: CompanyInterestPage },
      { path: 'interesse', lazy: CompanyInterestPage },
      { path: 'contact', children: contactRoute },
      { path: 'kontakt', children: contactRoute },
      { path: 'forum/*', children: forumRoute },
      { path: 'interest-groups/*', children: interestGroupsRoute },
      { path: 'interestgroups/*', children: interestGroupsRoute },
      { path: 'lending/*', children: lendingRoute },
      { path: 'meetings/*', children: meetingsRoute },
      { path: 'photos/*', children: photosRoute },
      { path: 'polls/*', children: pollsRoute },
      { path: 'quotes/*', children: quotesRoute },
      { path: 'sudo/*', children: hiddenAdminRoute },
      { path: 'search', children: searchRoute },
      { path: 'surveys/*', children: surveysRoute },
      { path: 'tags/*', children: tagsRoute },
      { path: 'timeline', children: timelineRoute },
      { path: 'validator', children: validatorRoute },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
