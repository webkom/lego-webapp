import { type RouteObject } from 'react-router';
import lendingRoute from 'app/routes/lending';
import { lazyComponent } from '~/utils/lazyComponent';
import { AppRoute } from './app';
import bdbRoute from './bdb';
import companyRoute from './company';
import forumRoute from './forum';
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
      { path: 'bdb/*', children: bdbRoute },
      { path: 'companies/*', children: companyRoute },
      { path: 'register-interest', lazy: CompanyInterestPage },
      { path: 'interesse', lazy: CompanyInterestPage },
      { path: 'forum/*', children: forumRoute },
      { path: 'lending/*', children: lendingRoute },
      { path: 'meetings/*', children: meetingsRoute },
      { path: 'surveys/*', children: surveysRoute },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
