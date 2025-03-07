import { type RouteObject } from 'react-router';
import { lazyComponent } from '~/utils/lazyComponent';
import { AppRoute } from './app';
import bdbRoute from './bdb';
import pageNotFound from './pageNotFound';

const CompanyInterestPage = lazyComponent(
  () =>
    import('./bdb/components/companyInterest/components/CompanyInterestPage'),
);

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { path: 'bdb/*', children: bdbRoute },
      { path: 'register-interest', lazy: CompanyInterestPage },
      { path: 'interesse', lazy: CompanyInterestPage },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
