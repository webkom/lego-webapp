import { type RouteObject } from 'react-router';
import lendingRoute from 'app/routes/lending';
import { lazyComponent } from '~/utils/lazyComponent';
import adminRoute from './admin';
import { AppRoute } from './app';
import authRoute from './auth';
import bdbRoute from './bdb';
import companyRoute from './company';
import forumRoute from './forum';
import hiddenAdminRoute from './hiddenAdmin';
import interestGroupsRoute from './interestgroups';
import meetingsRoute from './meetings';
import pageNotFound from './pageNotFound';
import surveysRoute from './surveys';

const CompanyInterestPage = lazyComponent(
  () =>
    import('./bdb/components/companyInterest/components/CompanyInterestPage'),
);

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { path: 'admin/*', children: adminRoute },
      { path: 'auth/*', children: authRoute },
      { path: 'bdb/*', children: bdbRoute },
      { path: 'companies/*', children: companyRoute },
      { path: 'register-interest', lazy: CompanyInterestPage },
      { path: 'interesse', lazy: CompanyInterestPage },
      { path: 'forum/*', children: forumRoute },
      { path: 'interest-groups/*', children: interestGroupsRoute },
      { path: 'interestgroups/*', children: interestGroupsRoute },
      { path: 'lending/*', children: lendingRoute },
      { path: 'meetings/*', children: meetingsRoute },
      { path: 'sudo/*', children: hiddenAdminRoute },
      { path: 'surveys/*', children: surveysRoute },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
