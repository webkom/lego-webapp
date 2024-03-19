import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const CompanyInterestList = loadable(
  () => import('./components/CompanyInterestList'),
);
const CompanyInterestPage = loadable(
  () => import('./components/CompanyInterestPage'),
);
const CompanySemesterGUI = loadable(
  () => import('./components/CompanySemesterGUI'),
);

const companyInterestRoute: RouteObject[] = [
  { index: true, Component: CompanyInterestList },
  { path: 'create', Component: CompanyInterestPage },
  { path: 'semesters', Component: CompanySemesterGUI },
  { path: ':companyInterestId/edit', Component: CompanyInterestPage },
  { path: '*', children: pageNotFound },
];

export default companyInterestRoute;
