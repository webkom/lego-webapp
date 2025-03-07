import { type RouteObject } from 'react-router';
import lendingRoute from 'app/routes/lending';
import { lazyComponent } from '~/utils/lazyComponent';
import achievementRoute from '../../pages/(migrated)/achievements';
import adminRoute from './admin';
import announcementsRoute from './announcements';
import { AppRoute } from './app';
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
import surveysRoute from './surveys';

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
      { path: 'sudo/*', children: hiddenAdminRoute },
      { path: 'surveys/*', children: surveysRoute },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
