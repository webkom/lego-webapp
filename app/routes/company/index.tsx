import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const CompaniesPage = loadable(() => import('./components/CompaniesPage'));
const CompanyDetail = loadable(() => import('./components/CompanyDetail'));

const companyRoute: RouteObject[] = [
  { index: true, Component: CompaniesPage },
  { path: ':companyId', Component: CompanyDetail },
  { path: '*', children: pageNotFound },
];

export default companyRoute;
