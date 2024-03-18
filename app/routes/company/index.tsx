import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const CompaniesPage = loadable(() => import('./components/CompaniesPage'));
const CompanyDetail = loadable(() => import('./components/CompanyDetail'));

const CompanyRoute: RouteObject[] = [
  { index: true, Component: CompaniesPage },
  { path: ':companyId', Component: CompanyDetail },
  { path: '*', children: PageNotFound },
];

export default CompanyRoute;
