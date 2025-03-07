import { type RouteObject } from 'react-router';
import { lazyComponent } from '~/utils/lazyComponent';
import { AppRoute } from './app';
import pageNotFound from './pageNotFound';

const CompanyInterestPage = lazyComponent(
  () => import('~/pages/(migrated)/bdb/company-interest/CompanyInterestForm'),
);

export const routerConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { path: 'register-interest', lazy: CompanyInterestPage },
      { path: 'interesse', lazy: CompanyInterestPage },
      { path: '*', children: pageNotFound },
    ],
  },
];

export default routerConfig;
