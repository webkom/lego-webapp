import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const BdbPage = loadable(() => import('./components/BdbPage'));
const CompanyEditor = loadable(() => import('./components/CompanyEditor'));
const BdbDetail = loadable(() => import('./components/BdbDetail'));
const AddSemester = loadable(() => import('./components/AddSemester'));
const CompanyContactEditor = loadable(
  () => import('./components/CompanyContactEditor'),
);
const CompanyInterestList = loadable(
  () => import('./components/companyInterest/components/CompanyInterestList'),
);
const CompanyInterestPage = loadable(
  () => import('./components/companyInterest/components/CompanyInterestPage'),
);
const CompanySemesterGUI = loadable(
  () => import('./components/companyInterest/components/CompanySemesterGUI'),
);

const bdbRoute: RouteObject[] = [
  { index: true, Component: BdbPage },
  { path: 'add', Component: CompanyEditor },
  { path: ':companyId', Component: BdbDetail },
  { path: ':companyId/edit', Component: CompanyEditor },
  { path: ':companyId/semesters/add', Component: AddSemester },
  { path: ':companyId/company-contacts/add', Component: CompanyContactEditor },
  {
    path: ':companyId/company-contacts/:companyContactId',
    Component: CompanyContactEditor,
  },
  { path: 'company-interest', Component: CompanyInterestList },
  { path: 'company-interest/create', Component: CompanyInterestPage },
  { path: 'company-interest/semesters', Component: CompanySemesterGUI },
  {
    path: 'company-interest/:companyInterestId/edit',
    Component: CompanyInterestPage,
  },
  { path: '*', children: pageNotFound },
];

export default bdbRoute;
