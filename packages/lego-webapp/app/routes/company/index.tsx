import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router';

const CompaniesPage = lazyComponent(() => import('./components/CompaniesPage'));
const CompanyDetail = lazyComponent(() => import('./components/CompanyDetail'));

const companyRoute: RouteObject[] = [
  { index: true, lazy: CompaniesPage },
  { path: ':companyId', lazy: CompanyDetail },
  { path: '*', children: pageNotFound },
];

export default companyRoute;
